## Hi there 👋

With SierraVault, your documents are finally secured. This is not just another application to store files — it is a national solution to a national problem that has affected Sierra Leone for decades. Lost documents, burnt files, damaged certificates, missing records… those days are over.

SierraVault is the most secure and dependable digital vault built on a highly protected blockchain system, designed to store your most important documents for your eyes and your access only.

What truly makes SierraVault stand out from every other platform is our enhanced login system. We introduced an optional NIN-based access feature, allowing users to connect their National Identification Number and verify their identity. This unlocks the ability to receive official government documents directly inside SierraVault, giving citizens a safer, faster, and more trustworthy way to access national services.

And we didn’t only build for the digitally educated — we built for everyone. That is why we integrated an AI Krio text-to-speech assistant. With just a tap, the AI reads out every page in clear Krio or English, making navigation simple, inclusive, and accessible to every Sierra Leonean, no matter their literacy level.

SierraVault isn’t just an app.
It is digital empowerment.
It is data security.
It is national progress.

SierraVault is how Sierra Leone secures its future — one document at a time.

## How to use
pnpm install within the folder

Because your NIN is not in the mongoDB database to be able to use the NIN login fetur use one of the below mock credential. Note: Some may have already br linked to someones account


/**
 * Paste one or more documents here
 */
[
  {
    "surname": "Kamara",
    "name": "Sorie",
    "middlename": "Amadu",
    "sex": "M",
    "height": "5'8\"",
    "dob": "1989-03-12T00:00:00.000Z",
    "dateOfExpiry": "2029-03-12T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000001",
    "nin": "1AAKDES"
  },
  {
    "surname": "Kargbo",
    "name": "Hawa",
    "middlename": "Isata",
    "sex": "F",
    "height": "5'5\"",
    "dob": "1992-07-22T00:00:00.000Z",
    "dateOfExpiry": "2032-07-22T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000002",
    "nin": "1BBHDES"
  },
  {
    "surname": "Bangura",
    "name": "Mohamed",
    "middlename": "Lamin",
    "sex": "M",
    "height": "5'10\"",
    "dob": "1986-11-09T00:00:00.000Z",
    "dateOfExpiry": "2026-11-09T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000003",
    "nin": "1CCMDES"
  },
  {
    "surname": "Sesay",
    "name": "Zainab",
    "middlename": "Mariama",
    "sex": "F",
    "height": "5'4\"",
    "dob": "1995-01-17T00:00:00.000Z",
    "dateOfExpiry": "2035-01-17T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000004",
    "nin": "1DDZDES"
  },
  {
    "surname": "Jalloh",
    "name": "Alpha",
    "middlename": "Saidu",
    "sex": "M",
    "height": "5'7\"",
    "dob": "1988-06-03T00:00:00.000Z",
    "dateOfExpiry": "2028-06-03T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000005",
    "nin": "1EEADES"
  },
  {
    "surname": "Turay",
    "name": "Fatmata",
    "middlename": "Hassan",
    "sex": "F",
    "height": "5'6\"",
    "dob": "1993-10-29T00:00:00.000Z",
    "dateOfExpiry": "2033-10-29T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000006",
    "nin": "1FFT DES"
  },
  {
    "surname": "Koroma",
    "name": "Ibrahim",
    "middlename": "Khalil",
    "sex": "M",
    "height": "5'11\"",
    "dob": "1987-09-14T00:00:00.000Z",
    "dateOfExpiry": "2027-09-14T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000007",
    "nin": "1GGIDES"
  },
  {
    "surname": "Dumbuya",
    "name": "Rugiatu",
    "middlename": "Adama",
    "sex": "F",
    "height": "5'3\"",
    "dob": "1991-02-05T00:00:00.000Z",
    "dateOfExpiry": "2031-02-05T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000008",
    "nin": "1HHDDES"
  },
  {
    "surname": "Conteh",
    "name": "Emmanuel",
    "middlename": "Joseph",
    "sex": "M",
    "height": "5'9\"",
    "dob": "1985-12-19T00:00:00.000Z",
    "dateOfExpiry": "2025-12-19T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000009",
    "nin": "1IIEDES"
  },
  {
    "surname": "Sankoh",
    "name": "Hindolo",
    "middlename": "Patrick",
    "sex": "M",
    "height": "5'8\"",
    "dob": "1990-08-08T00:00:00.000Z",
    "dateOfExpiry": "2030-08-08T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000010",
    "nin": "1JJPDES"
  },

  {
    "surname": "Barrie",
    "name": "Isatu",
    "middlename": "Kumba",
    "sex": "F",
    "height": "5'5\"",
    "dob": "1994-04-10T00:00:00.000Z",
    "dateOfExpiry": "2034-04-10T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000011",
    "nin": "1KKIDES"
  },
  {
    "surname": "Tarawallie",
    "name": "Sulaiman",
    "middlename": "Ishmail",
    "sex": "M",
    "height": "5'10\"",
    "dob": "1986-05-27T00:00:00.000Z",
    "dateOfExpiry": "2026-05-27T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000012",
    "nin": "1LLSDES"
  },
  {
    "surname": "Kabba",
    "name": "Hannah",
    "middlename": "Ramatu",
    "sex": "F",
    "height": "5'4\"",
    "dob": "1993-12-01T00:00:00.000Z",
    "dateOfExpiry": "2033-12-01T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000013",
    "nin": "1MMHDES"
  },
  {
    "surname": "Mansaray",
    "name": "Alhaji",
    "middlename": "Bockarie",
    "sex": "M",
    "height": "5'7\"",
    "dob": "1991-09-18T00:00:00.000Z",
    "dateOfExpiry": "2031-09-18T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000014",
    "nin": "1NNBDES"
  },
  {
    "surname": "Fofanah",
    "name": "Mariatu",
    "middlename": "Kadija",
    "sex": "F",
    "height": "5'6\"",
    "dob": "1992-03-03T00:00:00.000Z",
    "dateOfExpiry": "2032-03-03T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000015",
    "nin": "1OOFDES"
  },
  {
    "surname": "Bah",
    "name": "Abdul",
    "middlename": "Karim",
    "sex": "M",
    "height": "5'9\"",
    "dob": "1988-07-25T00:00:00.000Z",
    "dateOfExpiry": "2028-07-25T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000016",
    "nin": "1PPADES"
  },
  {
    "surname": "Fullah",
    "name": "Yainkain",
    "middlename": "Bintu",
    "sex": "F",
    "height": "5'3\"",
    "dob": "1996-06-14T00:00:00.000Z",
    "dateOfExpiry": "2036-06-14T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000017",
    "nin": "1QQYDES"
  },
  {
    "surname": "Sheriff",
    "name": "Samuel",
    "middlename": "Daniel",
    "sex": "M",
    "height": "5'10\"",
    "dob": "1985-02-20T00:00:00.000Z",
    "dateOfExpiry": "2025-02-20T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000018",
    "nin": "1RRS DES"
  },
  {
    "surname": "Moiba",
    "name": "Isata",
    "middlename": "Saffie",
    "sex": "F",
    "height": "5'5\"",
    "dob": "1995-11-11T00:00:00.000Z",
    "dateOfExpiry": "2035-11-11T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000019",
    "nin": "1SSTDES"
  },

  {
    "surname": "Williams",
    "name": "Christopher",
    "middlename": "George",
    "sex": "M",
    "height": "5'9\"",
    "dob": "1987-10-05T00:00:00.000Z",
    "dateOfExpiry": "2027-10-05T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000020",
    "nin": "1TTCDES"
  },
  {
    "surname": "Pearce",
    "name": "Abigail",
    "middlename": "Louisa",
    "sex": "F",
    "height": "5'6\"",
    "dob": "1993-09-03T00:00:00.000Z",
    "dateOfExpiry": "2033-09-03T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000021",
    "nin": "1UUA DES"
  },
  {
    "surname": "Davies",
    "name": "Jonathan",
    "middlename": "Peter",
    "sex": "M",
    "height": "5'8\"",
    "dob": "1986-04-28T00:00:00.000Z",
    "dateOfExpiry": "2026-04-28T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000022",
    "nin": "1VVJDES"
  },
  {
    "surname": "Thomas",
    "name": "Betty",
    "middlename": "Ann",
    "sex": "F",
    "height": "5'4\"",
    "dob": "1992-01-09T00:00:00.000Z",
    "dateOfExpiry": "2032-01-09T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000023",
    "nin": "1WWBDES"
  },
  {
    "surname": "Nelson",
    "name": "Michael",
    "middlename": "Andrew",
    "sex": "M",
    "height": "5'11\"",
    "dob": "1988-08-16T00:00:00.000Z",
    "dateOfExpiry": "2028-08-16T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000024",
    "nin": "1XXMDES"
  },
  {
    "surname": "Perry",
    "name": "Rita",
    "middlename": "Joyce",
    "sex": "F",
    "height": "5'5\"",
    "dob": "1994-03-02T00:00:00.000Z",
    "dateOfExpiry": "2034-03-02T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000025",
    "nin": "1YYRDES"
  },
  {
    "surname": "Johnson",
    "name": "Daniel",
    "middlename": "Cecil",
    "sex": "M",
    "height": "5'9\"",
    "dob": "1985-12-25T00:00:00.000Z",
    "dateOfExpiry": "2025-12-25T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000026",
    "nin": "1ZZDDES"
  },
  {
    "surname": "Smith",
    "name": "Jennifer",
    "middlename": "Rose",
    "sex": "F",
    "height": "5'6\"",
    "dob": "1996-05-30T00:00:00.000Z",
    "dateOfExpiry": "2036-05-30T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000027",
    "nin": "2AAR DES"
  },
  {
    "surname": "Richards",
    "name": "Samuel",
    "middlename": "Henry",
    "sex": "M",
    "height": "5'10\"",
    "dob": "1987-07-07T00:00:00.000Z",
    "dateOfExpiry": "2027-07-07T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000028",
    "nin": "2BBSDES"
  },
  {
    "surname": "Cole",
    "name": "Alice",
    "middlename": "Mary",
    "sex": "F",
    "height": "5'4\"",
    "dob": "1993-02-16T00:00:00.000Z",
    "dateOfExpiry": "2033-02-16T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000029",
    "nin": "2CCADES"
  },

  {
    "surname": "Caulker",
    "name": "Lawrence",
    "middlename": "Emmanuel",
    "sex": "M",
    "height": "5'9\"",
    "dob": "1989-01-15T00:00:00.000Z",
    "dateOfExpiry": "2029-01-15T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000030",
    "nin": "2DDLDES"
  },
  {
    "surname": "Bangalie",
    "name": "Kadiatu",
    "middlename": "Sia",
    "sex": "F",
    "height": "5'5\"",
    "dob": "1994-06-21T00:00:00.000Z",
    "dateOfExpiry": "2034-06-21T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000031",
    "nin": "2EEBDES"
  },
  {
    "surname": "Saffa",
    "name": "Ishmael",
    "middlename": "David",
    "sex": "M",
    "height": "5'8\"",
    "dob": "1986-03-05T00:00:00.000Z",
    "dateOfExpiry": "2026-03-05T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000032",
    "nin": "2FFIDES"
  },
  {
    "surname": "Lebbie",
    "name": "Rugiatu",
    "middlename": "Adama",
    "sex": "F",
    "height": "5'3\"",
    "dob": "1995-10-07T00:00:00.000Z",
    "dateOfExpiry": "2035-10-07T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000033",
    "nin": "2GGLDES"
  },
  {
    "surname": "Kallon",
    "name": "Jusu",
    "middlename": "Musa",
    "sex": "M",
    "height": "5'7\"",
    "dob": "1988-04-18T00:00:00.000Z",
    "dateOfExpiry": "2028-04-18T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000034",
    "nin": "2HHJDES"
  },
  {
    "surname": "Tucker",
    "name": "Gladys",
    "middlename": "Theresa",
    "sex": "F",
    "height": "5'5\"",
    "dob": "1993-09-23T00:00:00.000Z",
    "dateOfExpiry": "2033-09-23T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000035",
    "nin": "2IIGDES"
  },
  {
    "surname": "Sobie",
    "name": "Francis",
    "middlename": "Paul",
    "sex": "M",
    "height": "5'10\"",
    "dob": "1987-06-12T00:00:00.000Z",
    "dateOfExpiry": "2027-06-12T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000036",
    "nin": "2JJFDES"
  },
  {
    "surname": "Nallo",
    "name": "Mabel",
    "middlename": "Janet",
    "sex": "F",
    "height": "5'4\"",
    "dob": "1994-11-26T00:00:00.000Z",
    "dateOfExpiry": "2034-11-26T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000037",
    "nin": "2KKMDES"
  },
  {
    "surname": "Gbla",
    "name": "Peter",
    "middlename": "Mansaray",
    "sex": "M",
    "height": "5'8\"",
    "dob": "1986-03-15T00:00:00.000Z",
    "dateOfExpiry": "2026-03-15T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000038",
    "nin": "2LLSDES"
  },
  {
    "surname": "Forna",
    "name": "Yainkain",
    "middlename": "Fanta",
    "sex": "F",
    "height": "5'6\"",
    "dob": "1996-12-14T00:00:00.000Z",
    "dateOfExpiry": "2036-12-14T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000039",
    "nin": "2MMBDES"
  },

  {
    "surname": "Senessie",
    "name": "Augustine",
    "middlename": "Philip",
    "sex": "M",
    "height": "5'9\"",
    "dob": "1989-05-02T00:00:00.000Z",
    "dateOfExpiry": "2029-05-02T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000040",
    "nin": "2NNPDES"
  },
  {
    "surname": "Kowa",
    "name": "Adama",
    "middlename": "Saffie",
    "sex": "F",
    "height": "5'5\"",
    "dob": "1993-08-12T00:00:00.000Z",
    "dateOfExpiry": "2033-08-12T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000041",
    "nin": "2OOHDES"
  },
  {
    "surname": "Mambu",
    "name": "Solomon",
    "middlename": "Bai",
    "sex": "M",
    "height": "5'7\"",
    "dob": "1987-04-01T00:00:00.000Z",
    "dateOfExpiry": "2027-04-01T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000042",
    "nin": "2PPZDES"
  },
  {
    "surname": "Sengeh",
    "name": "Agnes",
    "middlename": "Marie",
    "sex": "F",
    "height": "5'4\"",
    "dob": "1995-07-29T00:00:00.000Z",
    "dateOfExpiry": "2035-07-29T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000043",
    "nin": "2QQRDES"
  },
  {
    "surname": "Gbessay",
    "name": "Jacob",
    "middlename": "Nathaniel",
    "sex": "M",
    "height": "5'8\"",
    "dob": "1988-10-11T00:00:00.000Z",
    "dateOfExpiry": "2028-10-11T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000044",
    "nin": "2RRDDES"
  },
  {
    "surname": "Tombo",
    "name": "Musu",
    "middlename": "Sia",
    "sex": "F",
    "height": "5'3\"",
    "dob": "1996-01-07T00:00:00.000Z",
    "dateOfExpiry": "2036-01-07T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000045",
    "nin": "2SSMDES"
  },
  {
    "surname": "Sow",
    "name": "Ishmail",
    "middlename": "Karama",
    "sex": "M",
    "height": "5'9\"",
    "dob": "1987-11-19T00:00:00.000Z",
    "dateOfExpiry": "2027-11-19T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000046",
    "nin": "2TTSDES"
  },
  {
    "surname": "Falla",
    "name": "Hawa",
    "middlename": "Yainkain",
    "sex": "F",
    "height": "5'4\"",
    "dob": "1994-02-13T00:00:00.000Z",
    "dateOfExpiry": "2034-02-13T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000047",
    "nin": "2UUBDES"
  },
  {
    "surname": "Sillah",
    "name": "Mohamed",
    "middlename": "Bashiru",
    "sex": "M",
    "height": "5'10\"",
    "dob": "1986-09-08T00:00:00.000Z",
    "dateOfExpiry": "2026-09-08T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000048",
    "nin": "2VVM DES"
  },
  {
    "surname": "Ganda",
    "name": "Rashida",
    "middlename": "Kadi",
    "sex": "F",
    "height": "5'6\"",
    "dob": "1993-06-21T00:00:00.000Z",
    "dateOfExpiry": "2033-06-21T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000049",
    "nin": "2WWFDES"
  },

  {
    "surname": "Saa",
    "name": "Ahmed",
    "middlename": "Tamba",
    "sex": "M",
    "height": "5'8\"",
    "dob": "1989-12-03T00:00:00.000Z",
    "dateOfExpiry": "2029-12-03T00:00:00.000Z",
    "personalIdNumber": "SL100000000000000000050",
    "nin": "2XXADES"
  }
]


USED

{
  "_id": {
    "$oid": "6932ea152c896087beb972df"
  },
  "surname": "Kamara",
  "name": "Abdul",
  "middlename": "Foday",
  "sex": "M",
  "height": "5'9\"",
  "dob": "1990-05-14T00:00:00.000Z",
  "dateOfExpiry": "2030-05-14T00:00:00.000Z",
  "personalIdNumber": "SL123456789012345678901",
  "nin": "1RRBDES"
}

{
  "surname": "Sesay",
  "name": "Aisha",
  "middlename": "Fatmata",
  "sex": "F",
  "height": "5'5\"",
  "dob": "1985-11-22T00:00:00.000Z",
  "dateOfExpiry": "2035-11-22T00:00:00.000Z",
  "personalIdNumber": "SL987654321098765432109",
  "nin": "2TYUJKL"
}
