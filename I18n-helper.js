#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os

for dir in os.listdir('app/i18n'):
	print(dir)
	print('''{
\t"name": "Translations - '''+dir+''' - Production",
\t"target": "translations-'''+dir+'''.js",
\t"debug": false,
\t"compress": true,
\t"files": [''')
	for file in os.listdir('app/i18n/'+dir):
		print('''\t\t{
\t\t\t"path": "app/i18n/'''+dir+'''/",
\t\t\t"name": "'''+file+'''"
\t\t},''')
	print('''\t]
},''')