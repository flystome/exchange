var collator = new Intl.Collator('de-u-co-phonebk')

const country = [{'name': 'Afghanistan'}, {'name': 'Åland Islands'}, {'name': 'Albania'}, {'name': 'Algeria'}, {'name': 'American Samoa'}, {'name': 'Andorra'}, {'name': 'Angola'}, {'name': 'Anguilla'}, {'name': 'Antarctica'}, {'name': 'Antigua and Barbuda'}, {'name': 'Argentina'}, {'name': 'Armenia'}, {'name': 'Aruba'}, {'name': 'Australia'}, {'name': 'Austria'}, {'name': 'Azerbaijan'}, {'name': 'The Bahamas'}, {'name': 'Bahrain'}, {'name': 'Bangladesh'}, {'name': 'Barbados'}, {'name': 'Belarus'}, {'name': 'Belgium'}, {'name': 'Belize'}, {'name': 'Benin'}, {'name': 'Bermuda'}, {'name': 'Bhutan'}, {'name': 'Bolivia'}, {'name': 'Bonaire'}, {'name': 'Bosnia and Herzegovina'}, {'name': 'Botswana'}, {'name': 'Bouvet Island'}, {'name': 'Brazil'}, {'name': 'British Indian Ocean Territory'}, {'name': 'United States Minor Outlying Islands'}, {'name': 'Virgin Islands (British)'}, {'name': 'Virgin Islands (U.S.)'}, {'name': 'Brunei'}, {'name': 'Bulgaria'}, {'name': 'Burkina Faso'}, {'name': 'Burundi'}, {'name': 'Cambodia'}, {'name': 'Cameroon'}, {'name': 'Canada'}, {'name': 'Cape Verde'}, {'name': 'Cayman Islands'}, {'name': 'Central African Republic'}, {'name': 'Chad'}, {'name': 'Chile'}, {'name': '中国'}, {'name': 'Christmas Island'}, {'name': 'Cocos (Keeling) Islands'}, {'name': 'Colombia'}, {'name': 'Comoros'}, {'name': 'Republic of the Congo'}, {'name': 'Democratic Republic of the Congo'}, {'name': 'Cook Islands'}, {'name': 'Costa Rica'}, {'name': 'Croatia'}, {'name': 'Cuba'}, {'name': 'Curaçao'}, {'name': 'Cyprus'}, {'name': 'Czech Republic'}, {'name': 'Denmark'}, {'name': 'Djibouti'}, {'name': 'Dominica'}, {'name': 'Dominican Republic'}, {'name': 'Ecuador'}, {'name': 'Egypt'}, {'name': 'El Salvador'}, {'name': 'Equatorial Guinea'}, {'name': 'Eritrea'}, {'name': 'Estonia'}, {'name': 'Ethiopia'}, {'name': 'Falkland Islands'}, {'name': 'Faroe Islands'}, {'name': 'Fiji'}, {'name': 'Finland'}, {'name': 'France'}, {'name': 'French Guiana'}, {'name': 'French Polynesia'}, {'name': 'French Southern and Antarctic Lands'}, {'name': 'Gabon'}, {'name': 'The Gambia'}, {'name': 'Georgia'}, {'name': 'Germany'}, {'name': 'Ghana'}, {'name': 'Gibraltar'}, {'name': 'Greece'}, {'name': 'Greenland'}, {'name': 'Grenada'}, {'name': 'Guadeloupe'}, {'name': 'Guam'}, {'name': 'Guatemala'}, {'name': 'Guernsey'}, {'name': 'Guinea'}, {'name': 'Guinea-Bissau'}, {'name': 'Guyana'}, {'name': 'Haiti'}, {'name': 'Heard Island and McDonald Islands'}, {'name': 'Holy See'}, {'name': 'Honduras'}, {'name': 'Hong Kong'}, {'name': 'Hungary'}, {'name': 'Iceland'}, {'name': 'India'}, {'name': 'Indonesia'}, {'name': 'Ivory Coast'}, {'name': 'Iran'}, {'name': 'Iraq'}, {'name': 'Republic of Ireland'}, {'name': 'Isle of Man'}, {'name': 'Israel'}, {'name': 'Italy'}, {'name': 'Jamaica'}, {'name': 'Japan'}, {'name': 'Jersey'}, {'name': 'Jordan'}, {'name': 'Kazakhstan'}, {'name': 'Kenya'}, {'name': 'Kiribati'}, {'name': 'Kuwait'}, {'name': 'Kyrgyzstan'}, {'name': 'Laos'}, {'name': 'Latvia'}, {'name': 'Lebanon'}, {'name': 'Lesotho'}, {'name': 'Liberia'}, {'name': 'Libya'}, {'name': 'Liechtenstein'}, {'name': 'Lithuania'}, {'name': 'Luxembourg'}, {'name': 'Macau'}, {'name': 'Republic of Macedonia'}, {'name': 'Madagascar'}, {'name': 'Malawi'}, {'name': 'Malaysia'}, {'name': 'Maldives'}, {'name': 'Mali'}, {'name': 'Malta'}, {'name': 'Marshall Islands'}, {'name': 'Martinique'}, {'name': 'Mauritania'}, {'name': 'Mauritius'}, {'name': 'Mayotte'}, {'name': 'Mexico'}, {'name': 'Federated States of Micronesia'}, {'name': 'Moldova'}, {'name': 'Monaco'}, {'name': 'Mongolia'}, {'name': 'Montenegro'}, {'name': 'Montserrat'}, {'name': 'Morocco'}, {'name': 'Mozambique'}, {'name': 'Myanmar'}, {'name': 'Namibia'}, {'name': 'Nauru'}, {'name': 'Nepal'}, {'name': 'Netherlands'}, {'name': 'New Caledonia'}, {'name': 'New Zealand'}, {'name': 'Nicaragua'}, {'name': 'Niger'}, {'name': 'Nigeria'}, {'name': 'Niue'}, {'name': 'Norfolk Island'}, {'name': 'North Korea'}, {'name': 'Northern Mariana Islands'}, {'name': 'Norway'}, {'name': 'Oman'}, {'name': 'Pakistan'}, {'name': 'Palau'}, {'name': 'Palestine'}, {'name': 'Panama'}, {'name': 'Papua New Guinea'}, {'name': 'Paraguay'}, {'name': 'Peru'}, {'name': 'Philippines'}, {'name': 'Pitcairn Islands'}, {'name': 'Poland'}, {'name': 'Portugal'}, {'name': 'Puerto Rico'}, {'name': 'Qatar'}, {'name': 'Republic of Kosovo'}, {'name': 'Réunion'}, {'name': 'Romania'}, {'name': 'Russia'}, {'name': 'Rwanda'}, {'name': 'Saint Barthélemy'}, {'name': 'Saint Helena'}, {'name': 'Saint Kitts and Nevis'}, {'name': 'Saint Lucia'}, {'name': 'Saint Martin'}, {'name': 'Saint Pierre and Miquelon'}, {'name': 'Saint Vincent and the Grenadines'}, {'name': 'Samoa'}, {'name': 'San Marino'}, {'name': 'São Tomé and Príncipe'}, {'name': 'Saudi Arabia'}, {'name': 'Senegal'}, {'name': 'Serbia'}, {'name': 'Seychelles'}, {'name': 'Sierra Leone'}, {'name': 'Singapore'}, {'name': 'Sint Maarten'}, {'name': 'Slovakia'}, {'name': 'Slovenia'}, {'name': 'Solomon Islands'}, {'name': 'Somalia'}, {'name': 'South Africa'}, {'name': 'South Georgia'}, {'name': 'South Korea'}, {'name': 'South Sudan'}, {'name': 'Spain'}, {'name': 'Sri Lanka'}, {'name': 'Sudan'}, {'name': 'Suriname'}, {'name': 'Svalbard and Jan Mayen'}, {'name': 'Swaziland'}, {'name': 'Sweden'}, {'name': 'Switzerland'}, {'name': 'Syria'}, {'name': 'Taiwan'}, {'name': 'Tajikistan'}, {'name': 'Tanzania'}, {'name': 'Thailand'}, {'name': 'East Timor'}, {'name': 'Togo'}, {'name': 'Tokelau'}, {'name': 'Tonga'}, {'name': 'Trinidad and Tobago'}, {'name': 'Tunisia'}, {'name': 'Turkey'}, {'name': 'Turkmenistan'}, {'name': 'Turks and Caicos Islands'}, {'name': 'Tuvalu'}, {'name': 'Uganda'}, {'name': 'Ukraine'}, {'name': 'United Arab Emirates'}, {'name': 'United Kingdom'}, {'name': 'United States'}, {'name': 'Uruguay'}, {'name': 'Uzbekistan'}, {'name': 'Vanuatu'}, {'name': 'Venezuela'}, {'name': 'Vietnam'}, {'name': 'Wallis and Futuna'}, {'name': 'Western Sahara'}, {'name': 'Yemen'}, {'name': 'Zambia'}, {'name': 'Zimbabwe'}]
export var countries = []
country.map((a) => {
  countries.push(a.name)
})
countries = countries.sort(collator.compare)

var callingCountries = require('country-data').countries
export const callingdata = callingCountries.all.map((d) => {
  if (!d.countryCallingCodes[0]) return
  return {
    alpha: d.alpha2,
    name: d.name,
    number: d.countryCallingCodes[0]
  }
}).filter((d) => d !== undefined)

callingdata.sort((a, b) => {
  return collator.compare(a.name, b.name)
})
