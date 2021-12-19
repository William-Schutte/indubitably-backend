import sys
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
    # Takes a list of pages of job entries
    job_data = []
    for page in l:
        job_entries = page.find_all('a', class_='fs-unmask')
        for job in job_entries:
            try:
                jobId = job['id']
                jobTitle = job.find('h2', class_='jobTitle').find_all('span')
                jobTitle = jobTitle[1].string if len(jobTitle) > 1 else jobTitle[0].string
                jobCompany = job.find('span', class_='companyName').string
                jobLocation = job.find('div', class_='companyLocation').string
                jobPay = job.find('div', class_='salary-snippet-container')
                if not jobPay:
                    jobPay = ''
                else:
                    jobPay = jobPay.get_text()
                # Currently date span contains a span with a keyword, either 'Posted' or 'Employed'
                # Then the visible text. E.g. <><span>Posted</span>Today<>
                jobPosted = ''
                for s in job.find('span', class_='date').stripped_strings:
                    jobPosted + s + ' '
                # Job info is an ul of bullet points about the job
                jobInfo = job.find('div', class_='job-snippet').find_all('li')
                jobInfoSnippets = []
                for item in jobInfo:
                    jobInfoSnippets.append(item.string)
                jobLink = 'www.indeed.com' + job['href']

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
        pages_to_search = 4

    # List of job containers from main site (50 per page)
    job_content = [parsed_html.find('div', id='mosaic-zone-jobcards')]
    job_content = job_content + get_more_pages(base_url, pages_to_search)

    # Get the jobs on all pages searched
    job_data = parse_job_data_from_pages(job_content)

    for i in range(0, len(job_data)):
        print(json.dumps(job_data[i]))

if __name__ == "__main__":
    main()
