# Sitemap Request Test
If you have sitemap like this: 
```
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> 
  <url>
    <loc>http://www.example.com/foo.html</loc>
    <lastmod>2018-06-04</lastmod>
  </url>
</urlset>
```
And if you want to know which url returns 404. You can check with this project.

1. clone repo
2. npm install
3. node app --sitemapurl=http://localhost:3001/sitemap_main.xml (your sitemap url)

After finish its job it returns a json file which name is url.json in repository.
