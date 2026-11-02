"""Import the public ACEG dealer directory without fabricating contact data."""
import json
from html.parser import HTMLParser
from pathlib import Path


class DirectoryParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_button = False
        self.in_content = False
        self.in_item = False
        self.province = ''
        self.text = ''
        self.items = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'button' and '@click' in attrs and 'selected' in attrs['@click']:
            self.in_button = True
            self.text = ''
        if tag == 'div' and 'accordion-content' in attrs.get('class', ''):
            self.in_content = True
        if tag == 'li' and self.in_content:
            self.in_item = True
            self.text = ''

    def handle_data(self, data):
        if self.in_button or self.in_item:
            self.text += data

    def handle_endtag(self, tag):
        if tag == 'button' and self.in_button:
            self.province = ' '.join(self.text.split())
            if self.province == 'Provincia BS.AS.':
                self.province = 'Buenos Aires'
            self.in_button = False
        if tag == 'li' and self.in_item:
            value = ' '.join(self.text.split())
            if '|' in value:
                name, phone = value.split('|', 1)
                self.items.append({'name': name.strip(), 'province': self.province, 'phone': phone.strip()})
            self.in_item = False
        if tag == 'ul' and self.in_content:
            self.in_content = False


parser = DirectoryParser()
parser.feed(Path('/private/tmp/aceg-dealers.html').read_text())
Path('src/data').mkdir(parents=True, exist_ok=True)
Path('src/data/dealers.json').write_text(json.dumps(parser.items, ensure_ascii=False, indent=2) + '\n')
print(f'Imported {len(parser.items)} public dealer records')
