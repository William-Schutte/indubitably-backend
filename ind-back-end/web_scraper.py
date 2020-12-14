from bs4 import BeautifulSoup
import json
import os
import sys
import csv

jobid = sys.argv[1]
total_jobs = sys.argv[2]

jobs_master_list = [{'total': total_jobs}]
cities_master_list = []

with open("./ind-back-end/uscities.csv", "r") as csvfile:
    reader = csv.reader(csvfile)
    for row in reader:
        cities_master_list.append(row)


def get_location(city, state):
    state_list = [row for row in cities_master_list if row[1]
                  == state]
    city_found = [row for row in state_list if row[0] == city]

    return city_found
    # return {'long': city_found[0][3], 'latt': city_found[0][2]}


for i in range(5):
    file_name = './bufferdata/indeed%s.html' % str(i)

    if os.path.isfile(file_name):

        try:
            with open(file_name, 'r') as html_file:

                # The soup variable is the read and parsed html document
                content = html_file.read()
                soup = BeautifulSoup(content, 'lxml')

                # The find_all method is being used here to find the html block for each job
                job_blocks = soup.find_all(
                    'div', class_='jobsearch-SerpJobCard')

                # Iterate over each job to extract all data
                for job in job_blocks:
                    # This header block contains both the Title and Job Link
                    job_h2 = job.find('h2').find('a')
                    job_title = job_h2.attrs['title']
                    job_link = job_h2.attrs['href']

                    job_company = job.find(
                        'span', class_='company').text.strip()
                    job_posted = job.find('span', class_='date').text.strip()
                    job_location = job.find(
                        'div', class_='recJobLoc').attrs['data-rc-loc']
                    job_coords = get_location(
                        job_location[0:-4], job_location[-2:])
                    job_summary = job.find(
                        'div', class_='summary').text.strip()

                    # Not all postings have salaries, for those that do, add them, else 'NA'
                    salary = job.find('span', class_='salaryText')
                    if (salary != None):
                        job_salary = salary.text.strip()
                    else:
                        job_salary = '$ No Data'

                    # Again, some jobs have requirements (multiple), others do not have any
                    # Each job will have a list of reqs (or an empty list)
                    reqs = job.find('div', class_='jobCardReqList')
                    job_reqs = []
                    if (reqs != None):
                        for req in reqs.find_all('div', class_='jobCardReqItem'):
                            job_reqs.append(req.text.strip())

                    jobs_master_list.append({
                        'title': job_title,
                        'company': job_company,
                        'posted': job_posted,
                        'location': job_location,
                        'coords': job_coords,
                        'link': job_link,
                        'salary': job_salary,
                        'summary': job_summary,
                        'reqs': job_reqs,
                        'blockId': jobid,
                    })
            os.remove('./bufferdata/indeed%s.html' % str(i))

        except IOError:
            print('%s HTML Files Read') % str(i+1)

# Write the list of job objects to JSON file
file_name = './bufferdata/data%s.json' % str(jobid)
with open(file_name, 'w+') as outfile:
    json.dump(jobs_master_list, outfile)

print(len(jobs_master_list))
