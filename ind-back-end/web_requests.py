from bs4 import BeautifulSoup
import requests
import sys

base_url = sys.argv[1]
data_dir = './bufferdata/'
# base_url = 'https://www.indeed.com/jobs?q=react%20developer&explvl=entry_level&sort=date&fromage=14&limit=50'

html_text = requests.get(base_url).text

soup = BeautifulSoup(html_text, 'lxml')

# Determines the total number of jobs. Indeed inflates this number with advertised and duplicate postings though.
# Best to round down a bit.
jobs_count = soup.find('div', id='searchCountPages').text.strip()
jobs_count = jobs_count.replace('Page 1 of ', '')
jobs_count = jobs_count.replace(' jobs', '')

pages_to_search = round(int(jobs_count.replace(',', '')) / 50)
if (pages_to_search == 0):
    pages_to_search = 1
elif (pages_to_search > 5):
    pages_to_search = 5

######
# Return constant to 5 later ^
######

# Write the first page of results to an html file
file_name = data_dir + "indeed0.html"
new_file = open(file_name, 'w')
new_file.write(html_text)
new_file.close()

# Write any subsequent pages to html
# &start=X Determines page number (Xth job, 50, 100, 150 ...)
for i in range(1, pages_to_search):
    html_text = requests.get(base_url + '&start=' + str(i * 50)).text
    file_name = data_dir + "indeed%s.html" % str(i)
    new_file = open(file_name, "w")
    new_file.write(html_text)
    new_file.close()

print(jobs_count)
