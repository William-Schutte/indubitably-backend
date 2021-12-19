import sys
import os
import os.path
import csv
import re
import math
import json
import requests
from bs4 import BeautifulSoup


def get_job_count(content):
    # Determines the total number of jobs.
    # Indeed inflates this number with advertised and duplicate postings.
    n = content.find('div', id='searchCountPages').text.strip()
    n = n.replace('Page 1 of ', '')
    n = n.replace(' jobs', '')
    return int(n.replace(',', ''))


def get_more_pages(url, n):
    job_pages = []
    for i in range(1, n):
        html = requests.get(url + '&start=' + str(i * 50)).text
        soup = BeautifulSoup(html, 'lxml')
        page_results = soup.find('div', id='mosaic-zone-jobcards')
        job_pages.append(page_results)
    return job_pages

def parse_job_data_from_pages(l):
    # This works as of 12/18/21
    # Due to the nature of webdevelopment and web-scraping, this will need constant maintenance
    cities_master_list = []
    cities_data_path = os.path.join(os.path.abspath(
        os.path.dirname(__file__)), 'uscities.csv')

    with open(cities_data_path, "r") as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            cities_master_list.append(row)

    def city_binary_search(loc, n, m):
        # loc is list ['City', 'State']
        if n > m:
            return -1
        centerIndex = math.floor((m + n) / 2)
        centerItem = cities_master_list[centerIndex][0:2]
        if loc < centerItem:
            return city_binary_search(loc, n, centerIndex - 1)
        elif loc > centerItem:
            return city_binary_search(loc, centerIndex + 1, m)
        elif loc == centerItem:
            return centerIndex

    def get_location(locationString):
        if locationString == "Remote":
            return "Remote"
        state = re.search(r", [A-Z]{2}", locationString).group(0)
        state = state.replace(', ', '')
        remote = "Remote" in locationString
        city = locationString.split(',')[0]

        index = city_binary_search([city, state], 0, len(cities_master_list) - 1)
        if index == -1:
            return { 'city': city, 'state': state, 'remote': remote }
        else:
            return cities_master_list[index]

    # Takes a list of pages of job entries
    job_data = []
    for page in l:
        job_entries = page.find_all('a', class_='fs-unmask')
        for job in job_entries:
            try:
                # Job ID, unique identifier from Indeed
                jobId = job['id']
                
                # Job Title, name of the job
                jobTitle = job.find('h2', class_='jobTitle').find_all('span')
                jobTitle = jobTitle[1].string if len(
                    jobTitle) > 1 else jobTitle[0].string

                # Job Company, name of employer
                jobCompany = job.find('span', class_='companyName').string

                # Job Location, will be either "Remote", [city, state, lat, long], or location string
                jobLocation = job.find(
                    'div', class_='companyLocation').get_text()
                jobLocation = get_location(jobLocation)

                # Job Pay, usually range of salary or hourly
                jobPay = job.find('div', class_='salary-snippet-container')
                if not jobPay:
                    jobPay = ''
                else:
                    jobPay = jobPay.get_text()

                # Job Posted, timeframe of posting/activity
                    # date span contains a span with a keyword, either 'Posted' or 'Employed'
                    # Then the visible text. E.g. <><span>Posted</span>Today<>
                jobPosted = job.find('span', class_='date').get_text()
                if 'Posted' in jobPosted:
                    jobPosted = { 'type': 'Posted', 'status': jobPosted.replace('Posted', '') }
                elif 'Employer' in jobPosted:
                    jobPosted = {'type': 'Employer', 'status': jobPosted.replace('Employer', '') }
                
                # Job Info Snippets, ul of bullet points about the position
                jobInfo = job.find('div', class_='job-snippet').find_all('li')
                jobInfoSnippets = []
                for item in jobInfo:
                    jobInfoSnippets.append(item.get_text())
                
                # Job Link, may be external site or indeed page
                jobLink = 'http://www.indeed.com' + job['href']

                new_job = {
                    'jobId': '' if jobId == None else jobId,
                    'jobTitle': '' if jobTitle == None else jobTitle,
                    'jobCompany': '' if jobCompany == None else jobCompany,
                    'jobLocation': '' if jobLocation == None else jobLocation,
                    'jobPay': '' if jobPay == None else jobPay,
                    'jobPosted': '' if jobPosted == None else jobPosted,
                    'jobInfoSnippets': '' if jobInfoSnippets == None else jobInfoSnippets,
                    'jobLink': '' if jobLink == None else jobLink,
                }
                job_data.append(new_job)
            except Exception as ex:
                pass
    return job_data


def main():
    base_url = sys.argv[1]
    html_data = requests.get(base_url).text
    parsed_html = BeautifulSoup(html_data, 'lxml')

    job_count = get_job_count(parsed_html)

    pages_to_search = math.floor(job_count / 60) + 1
    if (pages_to_search > 8):
        pages_to_search = 6

    # List of job containers from main site (50 per page)
    job_content = [parsed_html.find('div', id='mosaic-zone-jobcards')]
    job_content = job_content + get_more_pages(base_url, pages_to_search)

    # Get the jobs on all pages searched
    job_data = parse_job_data_from_pages(job_content)

    for i in range(0, len(job_data)):
        print(json.dumps(job_data[i]))

    print(json.dumps({'jobCount': job_count}))


if __name__ == "__main__":
    main()
