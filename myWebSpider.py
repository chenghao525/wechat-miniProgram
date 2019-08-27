import requests
from bs4 import BeautifulSoup

headers="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36";

def getHomePageText(url):
	try:
		r = requests.get(url, timeout=300);
		r.raise_for_status();
		r.encoding = r.apparent_encoding;
		return r.text;
	except:
		return "Err Occur";


def getAllCategory(pageText):
	#print(pageText);
	soup = BeautifulSoup(pageText,'lxml');
	category = soup.findAll(class_ = 'nav-item-products');
	print(category);

	for a in category:
		hrefs = a.getText();
		print(hrefs);





if __name__ == "__main__":
	url= "https://2021life.com";
	htmlPageText = getHomePageText(url);
	getAllCategory(htmlPageText);