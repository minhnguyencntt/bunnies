const WorldExplorerLib = (function () {
  function flagOf(iso) {
    return String(iso).toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
  }
  const CONTINENTS = ["asia", "europe", "africa", "north_america", "south_america", "oceania"];
  const COUNTRIES = [
  {
    "id": "af",
    "isoCode": "AF",
    "name": "Afghanistan",
    "officialName": "Cộng hòa Hồi giáo Afghanistan",
    "nameEn": "Afghanistan",
    "officialNameEn": "Islamic Republic of Afghanistan",
    "flag": "🇦🇫",
    "capital": "Kabul",
    "capitalEn": "Kabul",
    "continent": "asia",
    "region": "Nam Á",
    "subRegion": "Trung Á – Nam Á",
    "languages": [
      "ps",
      "fa"
    ],
    "currency": "Afghani",
    "neighbors": [
      "ir",
      "tm",
      "uz",
      "tj",
      "cn",
      "pk"
    ],
    "geo": "landlocked",
    "landscape": "mountain",
    "flagColors": [
      "black",
      "red",
      "green"
    ],
    "altCities": [
      "Herat",
      "Kandahar",
      "Mazar-i-Sharif"
    ],
    "facts": [
      {
        "id": "af-geography-continent",
        "category": "geography",
        "vi": "Afghanistan nằm ở Châu Á.",
        "en": "Afghanistan is in Asia.",
        "question": "Afghanistan nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "af-capital-kabul",
        "category": "capital",
        "vi": "Thủ đô của Afghanistan là Kabul.",
        "en": "The capital of Afghanistan is Kabul.",
        "question": "Thủ đô của Afghanistan là thành phố nào?",
        "answers": [
          "Kabul",
          "Herat",
          "Kandahar",
          "Mazar-i-Sharif"
        ]
      },
      {
        "id": "af-geography-landlocked",
        "category": "geography",
        "vi": "Afghanistan không giáp biển.",
        "en": "Afghanistan is landlocked.",
        "question": "Điều nào đúng về Afghanistan?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "af-nature-hindu-kush",
        "category": "nature",
        "vi": "Dãy Hindu Kush chạy qua Afghanistan.",
        "en": "The Hindu Kush mountains run through Afghanistan.",
        "question": "Dãy núi lớn ở Afghanistan tên là gì?",
        "answers": [
          "Hindu Kush",
          "Alps",
          "Andes",
          "Atlas"
        ]
      }
    ]
  },
  {
    "id": "am",
    "isoCode": "AM",
    "name": "Armenia",
    "officialName": "Cộng hòa Armenia",
    "nameEn": "Armenia",
    "officialNameEn": "Republic of Armenia",
    "flag": "🇦🇲",
    "capital": "Yerevan",
    "capitalEn": "Yerevan",
    "continent": "asia",
    "region": "Tây Á",
    "subRegion": "Nam Kavkaz",
    "languages": [
      "hy"
    ],
    "currency": "Dram",
    "neighbors": [
      "ge",
      "az",
      "ir",
      "tr"
    ],
    "geo": "landlocked",
    "landscape": "mountain",
    "flagColors": [
      "red",
      "blue",
      "orange"
    ],
    "altCities": [
      "Gyumri",
      "Vanadzor"
    ],
    "facts": [
      {
        "id": "am-geography-continent",
        "category": "geography",
        "vi": "Armenia nằm ở Châu Á.",
        "en": "Armenia is in Asia.",
        "question": "Armenia nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "am-capital-yerevan",
        "category": "capital",
        "vi": "Thủ đô của Armenia là Yerevan.",
        "en": "The capital of Armenia is Yerevan.",
        "question": "Thủ đô của Armenia là thành phố nào?",
        "answers": [
          "Yerevan",
          "Gyumri",
          "Vanadzor",
          "Paris"
        ]
      },
      {
        "id": "am-geography-landlocked",
        "category": "geography",
        "vi": "Armenia không giáp biển.",
        "en": "Armenia is landlocked.",
        "question": "Điều nào đúng về Armenia?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "am-nature-mountains",
        "category": "nature",
        "vi": "Armenia là quốc gia miền núi không giáp biển.",
        "en": "Armenia is a mountainous landlocked country.",
        "question": "Armenia có đặc điểm nào?",
        "answers": [
          "Miền núi và không giáp biển",
          "Là quốc gia đảo",
          "Nằm ở Bắc Cực",
          "Nằm ở châu Đại Dương"
        ]
      }
    ]
  },
  {
    "id": "az",
    "isoCode": "AZ",
    "name": "Azerbaijan",
    "officialName": "Cộng hòa Azerbaijan",
    "nameEn": "Azerbaijan",
    "officialNameEn": "Republic of Azerbaijan",
    "flag": "🇦🇿",
    "capital": "Baku",
    "capitalEn": "Baku",
    "continent": "asia",
    "region": "Tây Á",
    "subRegion": "Nam Kavkaz",
    "languages": [
      "az"
    ],
    "currency": "Manat",
    "neighbors": [
      "ge",
      "ru",
      "ir",
      "am",
      "tr"
    ],
    "geo": "landlocked",
    "landscape": "temperate",
    "flagColors": [
      "blue",
      "red",
      "green"
    ],
    "altCities": [
      "Ganja",
      "Sumqayit"
    ],
    "facts": [
      {
        "id": "az-geography-continent",
        "category": "geography",
        "vi": "Azerbaijan nằm ở Châu Á.",
        "en": "Azerbaijan is in Asia.",
        "question": "Azerbaijan nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "az-capital-baku",
        "category": "capital",
        "vi": "Thủ đô của Azerbaijan là Baku.",
        "en": "The capital of Azerbaijan is Baku.",
        "question": "Thủ đô của Azerbaijan là thành phố nào?",
        "answers": [
          "Baku",
          "Ganja",
          "Sumqayit",
          "Paris"
        ]
      },
      {
        "id": "az-geography-landlocked",
        "category": "geography",
        "vi": "Azerbaijan không giáp biển.",
        "en": "Azerbaijan is landlocked.",
        "question": "Điều nào đúng về Azerbaijan?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "az-geography-caspian",
        "category": "geography",
        "vi": "Thủ đô Baku của Azerbaijan nằm bên Biển Caspi.",
        "en": "Baku, the capital of Azerbaijan, sits on the Caspian Sea.",
        "question": "Thủ đô Baku nằm bên biển hồ nào?",
        "answers": [
          "Biển Caspi",
          "Địa Trung Hải",
          "Biển Baltic",
          "Thái Bình Dương"
        ]
      }
    ]
  },
  {
    "id": "bh",
    "isoCode": "BH",
    "name": "Bahrain",
    "officialName": "Vương quốc Bahrain",
    "nameEn": "Bahrain",
    "officialNameEn": "Kingdom of Bahrain",
    "flag": "🇧🇭",
    "capital": "Manama",
    "capitalEn": "Manama",
    "continent": "asia",
    "region": "Tây Á",
    "subRegion": "Vịnh Ba Tư",
    "languages": [
      "ar"
    ],
    "currency": "Dinar",
    "neighbors": [],
    "geo": "island",
    "landscape": "desert",
    "flagColors": [
      "red",
      "white"
    ],
    "altCities": [
      "Muharraq",
      "Riffa"
    ],
    "facts": [
      {
        "id": "bh-geography-continent",
        "category": "geography",
        "vi": "Bahrain nằm ở Châu Á.",
        "en": "Bahrain is in Asia.",
        "question": "Bahrain nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "bh-capital-manama",
        "category": "capital",
        "vi": "Thủ đô của Bahrain là Manama.",
        "en": "The capital of Bahrain is Manama.",
        "question": "Thủ đô của Bahrain là thành phố nào?",
        "answers": [
          "Manama",
          "Muharraq",
          "Riffa",
          "Paris"
        ]
      },
      {
        "id": "bh-geography-island",
        "category": "geography",
        "vi": "Bahrain là một quốc gia đảo.",
        "en": "Bahrain is an island country.",
        "question": "Điều nào đúng về Bahrain?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "bh-language-ar",
        "category": "language",
        "vi": "Người dân Bahrain nói tiếng Ả Rập.",
        "en": "People in Bahrain speak tiếng Ả Rập.",
        "question": "Người dân Bahrain nói ngôn ngữ nào?",
        "answers": [
          "tiếng Ả Rập",
          "tiếng Việt",
          "tiếng Nhật",
          "tiếng Inuit"
        ]
      }
    ]
  },
  {
    "id": "bd",
    "isoCode": "BD",
    "name": "Bangladesh",
    "officialName": "Cộng hòa Nhân dân Bangladesh",
    "nameEn": "Bangladesh",
    "officialNameEn": "People's Republic of Bangladesh",
    "flag": "🇧🇩",
    "capital": "Dhaka",
    "capitalEn": "Dhaka",
    "continent": "asia",
    "region": "Nam Á",
    "subRegion": "Đồng bằng sông Hằng",
    "languages": [
      "bn"
    ],
    "currency": "Taka",
    "neighbors": [
      "in",
      "mm"
    ],
    "geo": "coastal",
    "landscape": "tropical",
    "flagColors": [
      "green",
      "red"
    ],
    "altCities": [
      "Chittagong",
      "Khulna",
      "Rajshahi"
    ],
    "facts": [
      {
        "id": "bd-geography-continent",
        "category": "geography",
        "vi": "Bangladesh nằm ở Châu Á.",
        "en": "Bangladesh is in Asia.",
        "question": "Bangladesh nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "bd-capital-dhaka",
        "category": "capital",
        "vi": "Thủ đô của Bangladesh là Dhaka.",
        "en": "The capital of Bangladesh is Dhaka.",
        "question": "Thủ đô của Bangladesh là thành phố nào?",
        "answers": [
          "Dhaka",
          "Chittagong",
          "Khulna",
          "Rajshahi"
        ]
      },
      {
        "id": "bd-geography-coast",
        "category": "geography",
        "vi": "Bangladesh giáp Vịnh Bengal.",
        "en": "Bangladesh borders the Vịnh Bengal.",
        "question": "Bangladesh giáp biển hoặc đại dương nào?",
        "answers": [
          "Vịnh Bengal",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "bd-geography-delta",
        "category": "geography",
        "vi": "Bangladesh nằm trên đồng bằng sông rất rộng, mùa mưa có nhiều nước.",
        "en": "Bangladesh sits on a very large river delta with lots of rain.",
        "question": "Bangladesh nằm trên dạng đất nào?",
        "answers": [
          "Đồng bằng sông",
          "Sa mạc cát",
          "Sông băng",
          "Cao nguyên băng"
        ]
      }
    ]
  },
  {
    "id": "bt",
    "isoCode": "BT",
    "name": "Bhutan",
    "officialName": "Vương quốc Bhutan",
    "nameEn": "Bhutan",
    "officialNameEn": "Kingdom of Bhutan",
    "flag": "🇧🇹",
    "capital": "Thimphu",
    "capitalEn": "Thimphu",
    "continent": "asia",
    "region": "Nam Á",
    "subRegion": "Himalaya",
    "languages": [
      "dz"
    ],
    "currency": "Ngultrum",
    "neighbors": [
      "cn",
      "in"
    ],
    "geo": "landlocked",
    "landscape": "mountain",
    "flagColors": [
      "yellow",
      "orange"
    ],
    "altCities": [
      "Paro",
      "Punakha"
    ],
    "facts": [
      {
        "id": "bt-geography-continent",
        "category": "geography",
        "vi": "Bhutan nằm ở Châu Á.",
        "en": "Bhutan is in Asia.",
        "question": "Bhutan nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "bt-capital-thimphu",
        "category": "capital",
        "vi": "Thủ đô của Bhutan là Thimphu.",
        "en": "The capital of Bhutan is Thimphu.",
        "question": "Thủ đô của Bhutan là thành phố nào?",
        "answers": [
          "Thimphu",
          "Paro",
          "Punakha",
          "Paris"
        ]
      },
      {
        "id": "bt-geography-landlocked",
        "category": "geography",
        "vi": "Bhutan không giáp biển.",
        "en": "Bhutan is landlocked.",
        "question": "Điều nào đúng về Bhutan?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "bt-nature-himalaya",
        "category": "nature",
        "vi": "Bhutan nằm trên dãy Himalaya.",
        "en": "Bhutan sits in the Himalaya mountains.",
        "question": "Bhutan nằm trên dãy núi nào?",
        "answers": [
          "Himalaya",
          "Alps",
          "Andes",
          "Atlas"
        ]
      }
    ]
  },
  {
    "id": "bn",
    "isoCode": "BN",
    "name": "Brunei",
    "officialName": "Brunei Darussalam",
    "nameEn": "Brunei",
    "officialNameEn": "Brunei Darussalam",
    "flag": "🇧🇳",
    "capital": "Bandar Seri Begawan",
    "capitalEn": "Bandar Seri Begawan",
    "continent": "asia",
    "region": "Đông Nam Á",
    "subRegion": "Đảo Borneo",
    "languages": [
      "ms"
    ],
    "currency": "Đô la Brunei",
    "neighbors": [
      "my"
    ],
    "geo": "coastal",
    "landscape": "rainforest",
    "flagColors": [
      "yellow",
      "black",
      "white",
      "red"
    ],
    "altCities": [
      "Kuala Belait",
      "Seria"
    ],
    "facts": [
      {
        "id": "bn-geography-continent",
        "category": "geography",
        "vi": "Brunei nằm ở Châu Á.",
        "en": "Brunei is in Asia.",
        "question": "Brunei nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "bn-capital-bandar-seri-begawan",
        "category": "capital",
        "vi": "Thủ đô của Brunei là Bandar Seri Begawan.",
        "en": "The capital of Brunei is Bandar Seri Begawan.",
        "question": "Thủ đô của Brunei là thành phố nào?",
        "answers": [
          "Bandar Seri Begawan",
          "Kuala Belait",
          "Seria",
          "Paris"
        ]
      },
      {
        "id": "bn-geography-coast",
        "category": "geography",
        "vi": "Brunei giáp Biển Đông.",
        "en": "Brunei borders the Biển Đông.",
        "question": "Brunei giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Đông",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "bn-nature-borneo",
        "category": "nature",
        "vi": "Brunei nằm trên đảo Borneo, có rừng mưa.",
        "en": "Brunei is on the island of Borneo and has rainforest.",
        "question": "Brunei nằm trên đảo nào?",
        "answers": [
          "Borneo",
          "Madagascar",
          "Honshu",
          "Greenland"
        ]
      }
    ]
  },
  {
    "id": "kh",
    "isoCode": "KH",
    "name": "Campuchia",
    "officialName": "Vương quốc Campuchia",
    "nameEn": "Cambodia",
    "officialNameEn": "Kingdom of Cambodia",
    "flag": "🇰🇭",
    "capital": "Phnom Penh",
    "capitalEn": "Phnom Penh",
    "continent": "asia",
    "region": "Đông Nam Á",
    "subRegion": "Đông Dương",
    "languages": [
      "km"
    ],
    "currency": "Riel",
    "neighbors": [
      "th",
      "la",
      "vn"
    ],
    "geo": "coastal",
    "landscape": "tropical",
    "flagColors": [
      "red",
      "blue"
    ],
    "altCities": [
      "Siem Reap",
      "Battambang",
      "Sihanoukville"
    ],
    "facts": [
      {
        "id": "kh-geography-continent",
        "category": "geography",
        "vi": "Campuchia nằm ở Châu Á.",
        "en": "Cambodia is in Asia.",
        "question": "Campuchia nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "kh-capital-phnom-penh",
        "category": "capital",
        "vi": "Thủ đô của Campuchia là Phnom Penh.",
        "en": "The capital of Cambodia is Phnom Penh.",
        "question": "Thủ đô của Campuchia là thành phố nào?",
        "answers": [
          "Phnom Penh",
          "Siem Reap",
          "Battambang",
          "Sihanoukville"
        ]
      },
      {
        "id": "kh-geography-coast",
        "category": "geography",
        "vi": "Campuchia giáp Vịnh Thái Lan.",
        "en": "Cambodia borders the Vịnh Thái Lan.",
        "question": "Campuchia giáp biển hoặc đại dương nào?",
        "answers": [
          "Vịnh Thái Lan",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "kh-landmarks-angkor",
        "category": "landmarks",
        "vi": "Đền Angkor Wat là ngôi đền đá rất lớn ở Campuchia.",
        "en": "Angkor Wat is a very large stone temple in Cambodia.",
        "question": "Ngôi đền đá nổi tiếng ở Campuchia tên là gì?",
        "answers": [
          "Angkor Wat",
          "Taj Mahal",
          "Kim tự tháp",
          "Colosseum"
        ]
      }
    ]
  },
  {
    "id": "cn",
    "isoCode": "CN",
    "name": "Trung Quốc",
    "officialName": "Cộng hòa Nhân dân Trung Hoa",
    "nameEn": "China",
    "officialNameEn": "People's Republic of China",
    "flag": "🇨🇳",
    "capital": "Bắc Kinh",
    "capitalEn": "Beijing",
    "continent": "asia",
    "region": "Đông Á",
    "subRegion": "Đông Á lục địa",
    "languages": [
      "zh"
    ],
    "currency": "Nhân dân tệ",
    "neighbors": [
      "mn",
      "ru",
      "kp",
      "vn",
      "la",
      "mm",
      "in",
      "bt",
      "np",
      "pk",
      "af",
      "tj",
      "kg",
      "kz"
    ],
    "geo": "coastal",
    "landscape": "temperate",
    "flagColors": [
      "red",
      "yellow"
    ],
    "altCities": [
      "Thượng Hải",
      "Quảng Châu",
      "Thành Đô",
      "Tây An"
    ],
    "facts": [
      {
        "id": "cn-geography-continent",
        "category": "geography",
        "vi": "Trung Quốc nằm ở Châu Á.",
        "en": "China is in Asia.",
        "question": "Trung Quốc nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "cn-capital-beijing",
        "category": "capital",
        "vi": "Thủ đô của Trung Quốc là Bắc Kinh.",
        "en": "The capital of China is Beijing.",
        "question": "Thủ đô của Trung Quốc là thành phố nào?",
        "answers": [
          "Bắc Kinh",
          "Thượng Hải",
          "Quảng Châu",
          "Thành Đô"
        ]
      },
      {
        "id": "cn-geography-coast",
        "category": "geography",
        "vi": "Trung Quốc giáp Thái Bình Dương.",
        "en": "China borders the Thái Bình Dương.",
        "question": "Trung Quốc giáp biển hoặc đại dương nào?",
        "answers": [
          "Thái Bình Dương",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "cn-landmarks-wall",
        "category": "landmarks",
        "vi": "Vạn Lý Trường Thành là công trình tường đá rất dài ở Trung Quốc.",
        "en": "The Great Wall is a very long stone wall in China.",
        "question": "Bức tường đá rất dài ở Trung Quốc tên là gì?",
        "answers": [
          "Vạn Lý Trường Thành",
          "Tháp Eiffel",
          "Kim tự tháp",
          "Tượng Nữ thần Tự do"
        ]
      },
      {
        "id": "cn-animals-panda",
        "category": "animals",
        "vi": "Gấu trúc sống ở rừng tre Trung Quốc.",
        "en": "Giant pandas live in China's bamboo forests.",
        "question": "Con vật đen trắng sống ở rừng tre Trung Quốc là gì?",
        "answers": [
          "Gấu trúc",
          "Gấu koala",
          "Hổ",
          "Gấu Bắc Cực"
        ]
      }
    ]
  },
  {
    "id": "cy",
    "isoCode": "CY",
    "name": "Síp",
    "officialName": "Cộng hòa Síp",
    "nameEn": "Cyprus",
    "officialNameEn": "Republic of Cyprus",
    "flag": "🇨🇾",
    "capital": "Nicosia",
    "capitalEn": "Nicosia",
    "continent": "asia",
    "region": "Tây Á",
    "subRegion": "Địa Trung Hải",
    "languages": [
      "el",
      "tr"
    ],
    "currency": "Euro",
    "neighbors": [],
    "geo": "island",
    "landscape": "temperate",
    "flagColors": [
      "white",
      "orange"
    ],
    "altCities": [
      "Limassol",
      "Larnaca",
      "Paphos"
    ],
    "facts": [
      {
        "id": "cy-geography-continent",
        "category": "geography",
        "vi": "Síp nằm ở Châu Á.",
        "en": "Cyprus is in Asia.",
        "question": "Síp nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "cy-capital-nicosia",
        "category": "capital",
        "vi": "Thủ đô của Síp là Nicosia.",
        "en": "The capital of Cyprus is Nicosia.",
        "question": "Thủ đô của Síp là thành phố nào?",
        "answers": [
          "Nicosia",
          "Limassol",
          "Larnaca",
          "Paphos"
        ]
      },
      {
        "id": "cy-geography-island",
        "category": "geography",
        "vi": "Síp là một quốc gia đảo.",
        "en": "Cyprus is an island country.",
        "question": "Điều nào đúng về Síp?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "cy-geography-med",
        "category": "geography",
        "vi": "Síp là một hòn đảo trên Địa Trung Hải.",
        "en": "Cyprus is an island in the Mediterranean Sea.",
        "question": "Síp là đảo trên biển nào?",
        "answers": [
          "Địa Trung Hải",
          "Biển Baltic",
          "Thái Bình Dương",
          "Biển Đỏ"
        ]
      }
    ]
  },
  {
    "id": "ge",
    "isoCode": "GE",
    "name": "Gruzia",
    "officialName": "Gruzia",
    "nameEn": "Georgia",
    "officialNameEn": "Georgia",
    "flag": "🇬🇪",
    "capital": "Tbilisi",
    "capitalEn": "Tbilisi",
    "continent": "asia",
    "region": "Tây Á",
    "subRegion": "Nam Kavkaz",
    "languages": [
      "ka"
    ],
    "currency": "Lari",
    "neighbors": [
      "ru",
      "az",
      "am",
      "tr"
    ],
    "geo": "coastal",
    "landscape": "mountain",
    "flagColors": [
      "white",
      "red"
    ],
    "altCities": [
      "Batumi",
      "Kutaisi"
    ],
    "facts": [
      {
        "id": "ge-geography-continent",
        "category": "geography",
        "vi": "Gruzia nằm ở Châu Á.",
        "en": "Georgia is in Asia.",
        "question": "Gruzia nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "ge-capital-tbilisi",
        "category": "capital",
        "vi": "Thủ đô của Gruzia là Tbilisi.",
        "en": "The capital of Georgia is Tbilisi.",
        "question": "Thủ đô của Gruzia là thành phố nào?",
        "answers": [
          "Tbilisi",
          "Batumi",
          "Kutaisi",
          "Paris"
        ]
      },
      {
        "id": "ge-geography-coast",
        "category": "geography",
        "vi": "Gruzia giáp Biển Đen.",
        "en": "Georgia borders the Biển Đen.",
        "question": "Gruzia giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Đen",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "ge-nature-caucasus",
        "category": "nature",
        "vi": "Dãy Kavkaz chạy qua Gruzia.",
        "en": "The Caucasus Mountains run through Georgia.",
        "question": "Dãy núi lớn ở Gruzia tên là gì?",
        "answers": [
          "Kavkaz",
          "Alps",
          "Andes",
          "Atlas"
        ]
      }
    ]
  },
  {
    "id": "in",
    "isoCode": "IN",
    "name": "Ấn Độ",
    "officialName": "Cộng hòa Ấn Độ",
    "nameEn": "India",
    "officialNameEn": "Republic of India",
    "flag": "🇮🇳",
    "capital": "New Delhi",
    "capitalEn": "New Delhi",
    "continent": "asia",
    "region": "Nam Á",
    "subRegion": "Tiểu lục địa Ấn Độ",
    "languages": [
      "hi",
      "en"
    ],
    "currency": "Rupee",
    "neighbors": [
      "pk",
      "cn",
      "np",
      "bt",
      "mm",
      "bd"
    ],
    "geo": "coastal",
    "landscape": "tropical",
    "flagColors": [
      "orange",
      "white",
      "green"
    ],
    "altCities": [
      "Mumbai",
      "Kolkata",
      "Bengaluru",
      "Chennai"
    ],
    "facts": [
      {
        "id": "in-geography-continent",
        "category": "geography",
        "vi": "Ấn Độ nằm ở Châu Á.",
        "en": "India is in Asia.",
        "question": "Ấn Độ nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "in-capital-new-delhi",
        "category": "capital",
        "vi": "Thủ đô của Ấn Độ là New Delhi.",
        "en": "The capital of India is New Delhi.",
        "question": "Thủ đô của Ấn Độ là thành phố nào?",
        "answers": [
          "New Delhi",
          "Mumbai",
          "Kolkata",
          "Bengaluru"
        ]
      },
      {
        "id": "in-geography-coast",
        "category": "geography",
        "vi": "Ấn Độ giáp Ấn Độ Dương.",
        "en": "India borders the Ấn Độ Dương.",
        "question": "Ấn Độ giáp biển hoặc đại dương nào?",
        "answers": [
          "Ấn Độ Dương",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "in-landmarks-taj",
        "category": "landmarks",
        "vi": "Đền Taj Mahal bằng đá cẩm thạch trắng nằm ở Ấn Độ.",
        "en": "The Taj Mahal is a white marble monument in India.",
        "question": "Ngôi đền đá trắng nổi tiếng ở Ấn Độ tên là gì?",
        "answers": [
          "Taj Mahal",
          "Tháp Eiffel",
          "Colosseum",
          "Angkor Wat"
        ]
      }
    ]
  },
  {
    "id": "id",
    "isoCode": "ID",
    "name": "Indonesia",
    "officialName": "Cộng hòa Indonesia",
    "nameEn": "Indonesia",
    "officialNameEn": "Republic of Indonesia",
    "flag": "🇮🇩",
    "capital": "Jakarta",
    "capitalEn": "Jakarta",
    "continent": "asia",
    "region": "Đông Nam Á",
    "subRegion": "Quần đảo Mã Lai",
    "languages": [
      "id"
    ],
    "currency": "Rupiah",
    "neighbors": [
      "my",
      "pg",
      "tl"
    ],
    "geo": "island",
    "landscape": "rainforest",
    "flagColors": [
      "red",
      "white"
    ],
    "altCities": [
      "Surabaya",
      "Bandung",
      "Medan",
      "Yogyakarta"
    ],
    "facts": [
      {
        "id": "id-geography-continent",
        "category": "geography",
        "vi": "Indonesia nằm ở Châu Á.",
        "en": "Indonesia is in Asia.",
        "question": "Indonesia nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "id-capital-jakarta",
        "category": "capital",
        "vi": "Thủ đô của Indonesia là Jakarta.",
        "en": "The capital of Indonesia is Jakarta.",
        "question": "Thủ đô của Indonesia là thành phố nào?",
        "answers": [
          "Jakarta",
          "Surabaya",
          "Bandung",
          "Medan"
        ]
      },
      {
        "id": "id-geography-island",
        "category": "geography",
        "vi": "Indonesia là một quốc gia đảo.",
        "en": "Indonesia is an island country.",
        "question": "Điều nào đúng về Indonesia?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "id-animals-komodo",
        "category": "animals",
        "vi": "Rồng Komodo là loài thằn lằn rất lớn sống ở Indonesia.",
        "en": "Komodo dragons are very large lizards that live in Indonesia.",
        "question": "Loài thằn lằn rất lớn sống ở Indonesia tên là gì?",
        "answers": [
          "Rồng Komodo",
          "Cá sấu Nile",
          "Tắc kè hoa",
          "Rùa biển"
        ]
      }
    ]
  },
  {
    "id": "ir",
    "isoCode": "IR",
    "name": "Iran",
    "officialName": "Cộng hòa Hồi giáo Iran",
    "nameEn": "Iran",
    "officialNameEn": "Islamic Republic of Iran",
    "flag": "🇮🇷",
    "capital": "Tehran",
    "capitalEn": "Tehran",
    "continent": "asia",
    "region": "Tây Á",
    "subRegion": "Tây Á",
    "languages": [
      "fa"
    ],
    "currency": "Rial",
    "neighbors": [
      "tr",
      "iq",
      "pk",
      "af",
      "tm",
      "az",
      "am"
    ],
    "geo": "coastal",
    "landscape": "desert",
    "flagColors": [
      "green",
      "white",
      "red"
    ],
    "altCities": [
      "Isfahan",
      "Shiraz",
      "Mashhad"
    ],
    "facts": [
      {
        "id": "ir-geography-continent",
        "category": "geography",
        "vi": "Iran nằm ở Châu Á.",
        "en": "Iran is in Asia.",
        "question": "Iran nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "ir-capital-tehran",
        "category": "capital",
        "vi": "Thủ đô của Iran là Tehran.",
        "en": "The capital of Iran is Tehran.",
        "question": "Thủ đô của Iran là thành phố nào?",
        "answers": [
          "Tehran",
          "Isfahan",
          "Shiraz",
          "Mashhad"
        ]
      },
      {
        "id": "ir-geography-coast",
        "category": "geography",
        "vi": "Iran giáp Vịnh Ba Tư.",
        "en": "Iran borders the Vịnh Ba Tư.",
        "question": "Iran giáp biển hoặc đại dương nào?",
        "answers": [
          "Vịnh Ba Tư",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "ir-landmarks-persepolis",
        "category": "landmarks",
        "vi": "Persepolis là thành phố đá cổ ở Iran.",
        "en": "Persepolis is an ancient stone city in Iran.",
        "question": "Thành phố đá cổ nổi tiếng ở Iran tên là gì?",
        "answers": [
          "Persepolis",
          "Roma",
          "Athens",
          "Kyoto"
        ]
      }
    ]
  },
  {
    "id": "iq",
    "isoCode": "IQ",
    "name": "Iraq",
    "officialName": "Cộng hòa Iraq",
    "nameEn": "Iraq",
    "officialNameEn": "Republic of Iraq",
    "flag": "🇮🇶",
    "capital": "Baghdad",
    "capitalEn": "Baghdad",
    "continent": "asia",
    "region": "Tây Á",
    "subRegion": "Lưỡng Hà",
    "languages": [
      "ar"
    ],
    "currency": "Dinar",
    "neighbors": [
      "tr",
      "ir",
      "kw",
      "sa",
      "jo",
      "sy"
    ],
    "geo": "coastal",
    "landscape": "desert",
    "flagColors": [
      "red",
      "white",
      "black"
    ],
    "altCities": [
      "Basra",
      "Mosul",
      "Erbil"
    ],
    "facts": [
      {
        "id": "iq-geography-continent",
        "category": "geography",
        "vi": "Iraq nằm ở Châu Á.",
        "en": "Iraq is in Asia.",
        "question": "Iraq nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "iq-capital-baghdad",
        "category": "capital",
        "vi": "Thủ đô của Iraq là Baghdad.",
        "en": "The capital of Iraq is Baghdad.",
        "question": "Thủ đô của Iraq là thành phố nào?",
        "answers": [
          "Baghdad",
          "Basra",
          "Mosul",
          "Erbil"
        ]
      },
      {
        "id": "iq-geography-coast",
        "category": "geography",
        "vi": "Iraq giáp Vịnh Ba Tư.",
        "en": "Iraq borders the Vịnh Ba Tư.",
        "question": "Iraq giáp biển hoặc đại dương nào?",
        "answers": [
          "Vịnh Ba Tư",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "iq-geography-rivers",
        "category": "geography",
        "vi": "Hai sông Tigris và Euphrates chảy qua Iraq.",
        "en": "The Tigris and Euphrates rivers flow through Iraq.",
        "question": "Hai con sông nổi tiếng chảy qua Iraq tên là gì?",
        "answers": [
          "Tigris và Euphrates",
          "Nile và Amazon",
          "Mekong và Danube",
          "Yangtze và Ganges"
        ]
      }
    ]
  },
  {
    "id": "il",
    "isoCode": "IL",
    "name": "Israel",
    "officialName": "Nhà nước Israel",
    "nameEn": "Israel",
    "officialNameEn": "State of Israel",
    "flag": "🇮🇱",
    "capital": "Jerusalem",
    "capitalEn": "Jerusalem",
    "continent": "asia",
    "region": "Tây Á",
    "subRegion": "Đông Địa Trung Hải",
    "languages": [
      "he",
      "ar"
    ],
    "currency": "Shekel",
    "neighbors": [
      "lb",
      "sy",
      "jo",
      "eg",
      "ps"
    ],
    "geo": "coastal",
    "landscape": "desert",
    "flagColors": [
      "blue",
      "white"
    ],
    "altCities": [
      "Tel Aviv",
      "Haifa",
      "Eilat"
    ],
    "facts": [
      {
        "id": "il-geography-continent",
        "category": "geography",
        "vi": "Israel nằm ở Châu Á.",
        "en": "Israel is in Asia.",
        "question": "Israel nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "il-capital-jerusalem",
        "category": "capital",
        "vi": "Thủ đô của Israel là Jerusalem.",
        "en": "The capital of Israel is Jerusalem.",
        "question": "Thủ đô của Israel là thành phố nào?",
        "answers": [
          "Jerusalem",
          "Tel Aviv",
          "Haifa",
          "Eilat"
        ]
      },
      {
        "id": "il-geography-coast",
        "category": "geography",
        "vi": "Israel giáp Địa Trung Hải.",
        "en": "Israel borders the Địa Trung Hải.",
        "question": "Israel giáp biển hoặc đại dương nào?",
        "answers": [
          "Địa Trung Hải",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "il-nature-deadsea",
        "category": "nature",
        "vi": "Biển Chết gần Israel có nước rất mặn, người có thể nổi dễ dàng.",
        "en": "The Dead Sea near Israel is so salty that people float easily.",
        "question": "Biển rất mặn gần Israel, người nổi dễ dàng, tên là gì?",
        "answers": [
          "Biển Chết",
          "Biển Đỏ",
          "Biển Đen",
          "Biển Baltic"
        ]
      }
    ]
  },
  {
    "id": "jp",
    "isoCode": "JP",
    "name": "Nhật Bản",
    "officialName": "Nhật Bản",
    "nameEn": "Japan",
    "officialNameEn": "Japan",
    "flag": "🇯🇵",
    "capital": "Tokyo",
    "capitalEn": "Tokyo",
    "continent": "asia",
    "region": "Đông Á",
    "subRegion": "Quần đảo Nhật Bản",
    "languages": [
      "ja"
    ],
    "currency": "Yên",
    "neighbors": [],
    "geo": "island",
    "landscape": "temperate",
    "flagColors": [
      "white",
      "red"
    ],
    "altCities": [
      "Osaka",
      "Kyoto",
      "Yokohama",
      "Sapporo"
    ],
    "facts": [
      {
        "id": "jp-geography-continent",
        "category": "geography",
        "vi": "Nhật Bản nằm ở Châu Á.",
        "en": "Japan is in Asia.",
        "question": "Nhật Bản nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "jp-capital-tokyo",
        "category": "capital",
        "vi": "Thủ đô của Nhật Bản là Tokyo.",
        "en": "The capital of Japan is Tokyo.",
        "question": "Thủ đô của Nhật Bản là thành phố nào?",
        "answers": [
          "Tokyo",
          "Osaka",
          "Kyoto",
          "Yokohama"
        ]
      },
      {
        "id": "jp-geography-island",
        "category": "geography",
        "vi": "Nhật Bản là một quốc gia đảo.",
        "en": "Japan is an island country.",
        "question": "Điều nào đúng về Nhật Bản?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "jp-nature-fuji",
        "category": "nature",
        "vi": "Núi Phú Sĩ là ngọn núi nổi tiếng nhất Nhật Bản.",
        "en": "Mount Fuji is Japan's most famous mountain.",
        "question": "Ngọn núi nổi tiếng của Nhật Bản tên là gì?",
        "answers": [
          "Núi Phú Sĩ",
          "Núi Everest",
          "Núi Kilimanjaro",
          "Núi Andes"
        ]
      },
      {
        "id": "jp-food-sushi",
        "category": "food",
        "vi": "Sushi là món ăn nổi tiếng của Nhật Bản.",
        "en": "Sushi is a famous Japanese food.",
        "question": "Món cơm và cá sống nổi tiếng của Nhật Bản là gì?",
        "answers": [
          "Sushi",
          "Phở",
          "Paella",
          "Kimchi"
        ]
      }
    ]
  },
  {
    "id": "jo",
    "isoCode": "JO",
    "name": "Jordan",
    "officialName": "Vương quốc Hashemite Jordan",
    "nameEn": "Jordan",
    "officialNameEn": "Hashemite Kingdom of Jordan",
    "flag": "🇯🇴",
    "capital": "Amman",
    "capitalEn": "Amman",
    "continent": "asia",
    "region": "Tây Á",
    "subRegion": "Levant",
    "languages": [
      "ar"
    ],
    "currency": "Dinar",
    "neighbors": [
      "sy",
      "iq",
      "sa",
      "il",
      "ps"
    ],
    "geo": "coastal",
    "landscape": "desert",
    "flagColors": [
      "black",
      "white",
      "green",
      "red"
    ],
    "altCities": [
      "Aqaba",
      "Irbid",
      "Zarqa"
    ],
    "facts": [
      {
        "id": "jo-geography-continent",
        "category": "geography",
        "vi": "Jordan nằm ở Châu Á.",
        "en": "Jordan is in Asia.",
        "question": "Jordan nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "jo-capital-amman",
        "category": "capital",
        "vi": "Thủ đô của Jordan là Amman.",
        "en": "The capital of Jordan is Amman.",
        "question": "Thủ đô của Jordan là thành phố nào?",
        "answers": [
          "Amman",
          "Aqaba",
          "Irbid",
          "Zarqa"
        ]
      },
      {
        "id": "jo-geography-coast",
        "category": "geography",
        "vi": "Jordan giáp Biển Đỏ.",
        "en": "Jordan borders the Biển Đỏ.",
        "question": "Jordan giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Đỏ",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "jo-landmarks-petra",
        "category": "landmarks",
        "vi": "Petra là thành phố cổ được đục trong đá ở Jordan.",
        "en": "Petra is an ancient city carved into rock in Jordan.",
        "question": "Thành phố cổ đục trong đá ở Jordan tên là gì?",
        "answers": [
          "Petra",
          "Roma",
          "Athens",
          "Kyoto"
        ]
      }
    ]
  },
  {
    "id": "kz",
    "isoCode": "KZ",
    "name": "Kazakhstan",
    "officialName": "Cộng hòa Kazakhstan",
    "nameEn": "Kazakhstan",
    "officialNameEn": "Republic of Kazakhstan",
    "flag": "🇰🇿",
    "capital": "Astana",
    "capitalEn": "Astana",
    "continent": "asia",
    "region": "Trung Á",
    "subRegion": "Thảo nguyên Trung Á",
    "languages": [
      "kk",
      "ru"
    ],
    "currency": "Tenge",
    "neighbors": [
      "ru",
      "cn",
      "kg",
      "uz",
      "tm"
    ],
    "geo": "landlocked",
    "landscape": "temperate",
    "flagColors": [
      "blue",
      "yellow"
    ],
    "altCities": [
      "Almaty",
      "Shymkent",
      "Karaganda"
    ],
    "facts": [
      {
        "id": "kz-geography-continent",
        "category": "geography",
        "vi": "Kazakhstan nằm ở Châu Á.",
        "en": "Kazakhstan is in Asia.",
        "question": "Kazakhstan nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "kz-capital-astana",
        "category": "capital",
        "vi": "Thủ đô của Kazakhstan là Astana.",
        "en": "The capital of Kazakhstan is Astana.",
        "question": "Thủ đô của Kazakhstan là thành phố nào?",
        "answers": [
          "Astana",
          "Almaty",
          "Shymkent",
          "Karaganda"
        ]
      },
      {
        "id": "kz-geography-landlocked",
        "category": "geography",
        "vi": "Kazakhstan không giáp biển.",
        "en": "Kazakhstan is landlocked.",
        "question": "Điều nào đúng về Kazakhstan?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "kz-language-kk",
        "category": "language",
        "vi": "Người dân Kazakhstan nói tiếng Kazakh.",
        "en": "People in Kazakhstan speak tiếng Kazakh.",
        "question": "Người dân Kazakhstan nói ngôn ngữ nào?",
        "answers": [
          "tiếng Kazakh",
          "tiếng Việt",
          "tiếng Nhật",
          "tiếng Inuit"
        ]
      }
    ]
  },
  {
    "id": "kw",
    "isoCode": "KW",
    "name": "Kuwait",
    "officialName": "Nhà nước Kuwait",
    "nameEn": "Kuwait",
    "officialNameEn": "State of Kuwait",
    "flag": "🇰🇼",
    "capital": "Thành phố Kuwait",
    "capitalEn": "Kuwait City",
    "continent": "asia",
    "region": "Tây Á",
    "subRegion": "Vịnh Ba Tư",
    "languages": [
      "ar"
    ],
    "currency": "Dinar",
    "neighbors": [
      "iq",
      "sa"
    ],
    "geo": "coastal",
    "landscape": "desert",
    "flagColors": [
      "green",
      "white",
      "red",
      "black"
    ],
    "altCities": [
      "Hawalli",
      "Salmiya"
    ],
    "facts": [
      {
        "id": "kw-geography-continent",
        "category": "geography",
        "vi": "Kuwait nằm ở Châu Á.",
        "en": "Kuwait is in Asia.",
        "question": "Kuwait nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "kw-capital-kuwait-city",
        "category": "capital",
        "vi": "Thủ đô của Kuwait là Thành phố Kuwait.",
        "en": "The capital of Kuwait is Kuwait City.",
        "question": "Thủ đô của Kuwait là thành phố nào?",
        "answers": [
          "Thành phố Kuwait",
          "Hawalli",
          "Salmiya",
          "Paris"
        ]
      },
      {
        "id": "kw-geography-coast",
        "category": "geography",
        "vi": "Kuwait giáp Vịnh Ba Tư.",
        "en": "Kuwait borders the Vịnh Ba Tư.",
        "question": "Kuwait giáp biển hoặc đại dương nào?",
        "answers": [
          "Vịnh Ba Tư",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "kw-geography-gulf",
        "category": "geography",
        "vi": "Kuwait nằm trên Vịnh Ba Tư.",
        "en": "Kuwait sits on the Persian Gulf.",
        "question": "Kuwait giáp vịnh nào?",
        "answers": [
          "Vịnh Ba Tư",
          "Vịnh Mexico",
          "Vịnh Bengal",
          "Vịnh Guinea"
        ]
      }
    ]
  },
  {
    "id": "kg",
    "isoCode": "KG",
    "name": "Kyrgyzstan",
    "officialName": "Cộng hòa Kyrgyzstan",
    "nameEn": "Kyrgyzstan",
    "officialNameEn": "Kyrgyz Republic",
    "flag": "🇰🇬",
    "capital": "Bishkek",
    "capitalEn": "Bishkek",
    "continent": "asia",
    "region": "Trung Á",
    "subRegion": "Thiên Sơn",
    "languages": [
      "ky",
      "ru"
    ],
    "currency": "Som",
    "neighbors": [
      "kz",
      "cn",
      "tj",
      "uz"
    ],
    "geo": "landlocked",
    "landscape": "mountain",
    "flagColors": [
      "red",
      "yellow"
    ],
    "altCities": [
      "Osh",
      "Karakol"
    ],
    "facts": [
      {
        "id": "kg-geography-continent",
        "category": "geography",
        "vi": "Kyrgyzstan nằm ở Châu Á.",
        "en": "Kyrgyzstan is in Asia.",
        "question": "Kyrgyzstan nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "kg-capital-bishkek",
        "category": "capital",
        "vi": "Thủ đô của Kyrgyzstan là Bishkek.",
        "en": "The capital of Kyrgyzstan is Bishkek.",
        "question": "Thủ đô của Kyrgyzstan là thành phố nào?",
        "answers": [
          "Bishkek",
          "Osh",
          "Karakol",
          "Paris"
        ]
      },
      {
        "id": "kg-geography-landlocked",
        "category": "geography",
        "vi": "Kyrgyzstan không giáp biển.",
        "en": "Kyrgyzstan is landlocked.",
        "question": "Điều nào đúng về Kyrgyzstan?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "kg-nature-tianshan",
        "category": "nature",
        "vi": "Dãy Thiên Sơn chạy qua Kyrgyzstan.",
        "en": "The Tian Shan mountains run through Kyrgyzstan.",
        "question": "Dãy núi lớn ở Kyrgyzstan tên là gì?",
        "answers": [
          "Thiên Sơn",
          "Alps",
          "Andes",
          "Atlas"
        ]
      }
    ]
  },
  {
    "id": "la",
    "isoCode": "LA",
    "name": "Lào",
    "officialName": "Cộng hòa Dân chủ Nhân dân Lào",
    "nameEn": "Laos",
    "officialNameEn": "Lao People's Democratic Republic",
    "flag": "🇱🇦",
    "capital": "Viêng Chăn",
    "capitalEn": "Vientiane",
    "continent": "asia",
    "region": "Đông Nam Á",
    "subRegion": "Đông Dương",
    "languages": [
      "lo"
    ],
    "currency": "Kip",
    "neighbors": [
      "cn",
      "vn",
      "kh",
      "th",
      "mm"
    ],
    "geo": "landlocked",
    "landscape": "tropical",
    "flagColors": [
      "red",
      "blue",
      "white"
    ],
    "altCities": [
      "Luang Prabang",
      "Pakse",
      "Savannakhet"
    ],
    "facts": [
      {
        "id": "la-geography-continent",
        "category": "geography",
        "vi": "Lào nằm ở Châu Á.",
        "en": "Laos is in Asia.",
        "question": "Lào nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "la-capital-vientiane",
        "category": "capital",
        "vi": "Thủ đô của Lào là Viêng Chăn.",
        "en": "The capital of Laos is Vientiane.",
        "question": "Thủ đô của Lào là thành phố nào?",
        "answers": [
          "Viêng Chăn",
          "Luang Prabang",
          "Pakse",
          "Savannakhet"
        ]
      },
      {
        "id": "la-geography-landlocked",
        "category": "geography",
        "vi": "Lào không giáp biển.",
        "en": "Laos is landlocked.",
        "question": "Điều nào đúng về Lào?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "la-geography-mekong",
        "category": "geography",
        "vi": "Sông Mekong chảy qua Lào.",
        "en": "The Mekong River flows through Laos.",
        "question": "Con sông lớn chảy qua Lào tên là gì?",
        "answers": [
          "Sông Mekong",
          "Sông Nile",
          "Sông Amazon",
          "Sông Danube"
        ]
      }
    ]
  },
  {
    "id": "lb",
    "isoCode": "LB",
    "name": "Lebanon",
    "officialName": "Cộng hòa Lebanon",
    "nameEn": "Lebanon",
    "officialNameEn": "Lebanese Republic",
    "flag": "🇱🇧",
    "capital": "Beirut",
    "capitalEn": "Beirut",
    "continent": "asia",
    "region": "Tây Á",
    "subRegion": "Đông Địa Trung Hải",
    "languages": [
      "ar"
    ],
    "currency": "Bảng Lebanon",
    "neighbors": [
      "sy",
      "il"
    ],
    "geo": "coastal",
    "landscape": "temperate",
    "flagColors": [
      "red",
      "white",
      "green"
    ],
    "altCities": [
      "Tripoli",
      "Sidon",
      "Byblos"
    ],
    "facts": [
      {
        "id": "lb-geography-continent",
        "category": "geography",
        "vi": "Lebanon nằm ở Châu Á.",
        "en": "Lebanon is in Asia.",
        "question": "Lebanon nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "lb-capital-beirut",
        "category": "capital",
        "vi": "Thủ đô của Lebanon là Beirut.",
        "en": "The capital of Lebanon is Beirut.",
        "question": "Thủ đô của Lebanon là thành phố nào?",
        "answers": [
          "Beirut",
          "Tripoli",
          "Sidon",
          "Byblos"
        ]
      },
      {
        "id": "lb-geography-coast",
        "category": "geography",
        "vi": "Lebanon giáp Địa Trung Hải.",
        "en": "Lebanon borders the Địa Trung Hải.",
        "question": "Lebanon giáp biển hoặc đại dương nào?",
        "answers": [
          "Địa Trung Hải",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "lb-nature-cedar",
        "category": "nature",
        "vi": "Cây tuyết tùng xuất hiện trên quốc kỳ Lebanon.",
        "en": "A cedar tree appears on the flag of Lebanon.",
        "question": "Loại cây nào có trên quốc kỳ Lebanon?",
        "answers": [
          "Cây tuyết tùng",
          "Cây dừa",
          "Cây tre",
          "Cây phong"
        ]
      }
    ]
  },
  {
    "id": "my",
    "isoCode": "MY",
    "name": "Malaysia",
    "officialName": "Malaysia",
    "nameEn": "Malaysia",
    "officialNameEn": "Malaysia",
    "flag": "🇲🇾",
    "capital": "Kuala Lumpur",
    "capitalEn": "Kuala Lumpur",
    "continent": "asia",
    "region": "Đông Nam Á",
    "subRegion": "Bán đảo Mã Lai",
    "languages": [
      "ms"
    ],
    "currency": "Ringgit",
    "neighbors": [
      "th",
      "id",
      "bn"
    ],
    "geo": "coastal",
    "landscape": "rainforest",
    "flagColors": [
      "red",
      "white",
      "blue",
      "yellow"
    ],
    "altCities": [
      "George Town",
      "Johor Bahru",
      "Kota Kinabalu",
      "Ipoh"
    ],
    "facts": [
      {
        "id": "my-geography-continent",
        "category": "geography",
        "vi": "Malaysia nằm ở Châu Á.",
        "en": "Malaysia is in Asia.",
        "question": "Malaysia nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "my-capital-kuala-lumpur",
        "category": "capital",
        "vi": "Thủ đô của Malaysia là Kuala Lumpur.",
        "en": "The capital of Malaysia is Kuala Lumpur.",
        "question": "Thủ đô của Malaysia là thành phố nào?",
        "answers": [
          "Kuala Lumpur",
          "George Town",
          "Johor Bahru",
          "Kota Kinabalu"
        ]
      },
      {
        "id": "my-geography-coast",
        "category": "geography",
        "vi": "Malaysia giáp Biển Đông.",
        "en": "Malaysia borders the Biển Đông.",
        "question": "Malaysia giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Đông",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "my-nature-rainforest",
        "category": "nature",
        "vi": "Malaysia có rừng mưa nhiệt đới trên đảo Borneo.",
        "en": "Malaysia has tropical rainforests on the island of Borneo.",
        "question": "Malaysia có kiểu rừng nào trên đảo Borneo?",
        "answers": [
          "Rừng mưa nhiệt đới",
          "Rừng thông Bắc Cực",
          "Rừng bạch dương",
          "Rừng xương rồng"
        ]
      }
    ]
  },
  {
    "id": "mv",
    "isoCode": "MV",
    "name": "Maldives",
    "officialName": "Cộng hòa Maldives",
    "nameEn": "Maldives",
    "officialNameEn": "Republic of Maldives",
    "flag": "🇲🇻",
    "capital": "Malé",
    "capitalEn": "Malé",
    "continent": "asia",
    "region": "Nam Á",
    "subRegion": "Ấn Độ Dương",
    "languages": [
      "dv"
    ],
    "currency": "Rufiyaa",
    "neighbors": [],
    "geo": "island",
    "landscape": "island",
    "flagColors": [
      "red",
      "green",
      "white"
    ],
    "altCities": [
      "Addu",
      "Kulhudhuffushi"
    ],
    "facts": [
      {
        "id": "mv-geography-continent",
        "category": "geography",
        "vi": "Maldives nằm ở Châu Á.",
        "en": "Maldives is in Asia.",
        "question": "Maldives nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "mv-capital-malé",
        "category": "capital",
        "vi": "Thủ đô của Maldives là Malé.",
        "en": "The capital of Maldives is Malé.",
        "question": "Thủ đô của Maldives là thành phố nào?",
        "answers": [
          "Malé",
          "Addu",
          "Kulhudhuffushi",
          "Paris"
        ]
      },
      {
        "id": "mv-geography-island",
        "category": "geography",
        "vi": "Maldives là một quốc gia đảo.",
        "en": "Maldives is an island country.",
        "question": "Điều nào đúng về Maldives?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "mv-nature-coral",
        "category": "nature",
        "vi": "Maldives có nhiều đảo san hô thấp trên Ấn Độ Dương.",
        "en": "The Maldives has many low coral islands in the Indian Ocean.",
        "question": "Maldives nổi tiếng với loại đảo nào?",
        "answers": [
          "Đảo san hô",
          "Đảo núi lửa băng",
          "Đảo sa mạc",
          "Đảo sông"
        ]
      }
    ]
  },
  {
    "id": "mn",
    "isoCode": "MN",
    "name": "Mông Cổ",
    "officialName": "Mông Cổ",
    "nameEn": "Mongolia",
    "officialNameEn": "Mongolia",
    "flag": "🇲🇳",
    "capital": "Ulaanbaatar",
    "capitalEn": "Ulaanbaatar",
    "continent": "asia",
    "region": "Đông Á",
    "subRegion": "Thảo nguyên Trung Á",
    "languages": [
      "mn"
    ],
    "currency": "Tögrög",
    "neighbors": [
      "ru",
      "cn"
    ],
    "geo": "landlocked",
    "landscape": "desert",
    "flagColors": [
      "red",
      "blue",
      "yellow"
    ],
    "altCities": [
      "Erdenet",
      "Darkhan"
    ],
    "facts": [
      {
        "id": "mn-geography-continent",
        "category": "geography",
        "vi": "Mông Cổ nằm ở Châu Á.",
        "en": "Mongolia is in Asia.",
        "question": "Mông Cổ nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "mn-capital-ulaanbaatar",
        "category": "capital",
        "vi": "Thủ đô của Mông Cổ là Ulaanbaatar.",
        "en": "The capital of Mongolia is Ulaanbaatar.",
        "question": "Thủ đô của Mông Cổ là thành phố nào?",
        "answers": [
          "Ulaanbaatar",
          "Erdenet",
          "Darkhan",
          "Paris"
        ]
      },
      {
        "id": "mn-geography-landlocked",
        "category": "geography",
        "vi": "Mông Cổ không giáp biển.",
        "en": "Mongolia is landlocked.",
        "question": "Điều nào đúng về Mông Cổ?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "mn-nature-gobi",
        "category": "nature",
        "vi": "Sa mạc Gobi nằm ở Mông Cổ.",
        "en": "The Gobi Desert is in Mongolia.",
        "question": "Sa mạc nổi tiếng ở Mông Cổ tên là gì?",
        "answers": [
          "Sa mạc Gobi",
          "Sa mạc Sahara",
          "Sa mạc Namib",
          "Sa mạc Atacama"
        ]
      },
      {
        "id": "mn-animals-horse",
        "category": "animals",
        "vi": "Ngựa là con vật rất quan trọng với người Mông Cổ.",
        "en": "Horses are very important to Mongolian people.",
        "question": "Con vật rất quan trọng với người Mông Cổ là gì?",
        "answers": [
          "Ngựa",
          "Lạc đà không bướu",
          "Gấu trúc",
          "Kanguru"
        ]
      }
    ]
  },
  {
    "id": "mm",
    "isoCode": "MM",
    "name": "Myanmar",
    "officialName": "Cộng hòa Liên bang Myanmar",
    "nameEn": "Myanmar",
    "officialNameEn": "Republic of the Union of Myanmar",
    "flag": "🇲🇲",
    "capital": "Naypyidaw",
    "capitalEn": "Naypyidaw",
    "continent": "asia",
    "region": "Đông Nam Á",
    "subRegion": "Đông Dương",
    "languages": [
      "my"
    ],
    "currency": "Kyat",
    "neighbors": [
      "bd",
      "cn",
      "in",
      "la",
      "th"
    ],
    "geo": "coastal",
    "landscape": "tropical",
    "flagColors": [
      "yellow",
      "green",
      "red"
    ],
    "altCities": [
      "Yangon",
      "Mandalay",
      "Bagan"
    ],
    "facts": [
      {
        "id": "mm-geography-continent",
        "category": "geography",
        "vi": "Myanmar nằm ở Châu Á.",
        "en": "Myanmar is in Asia.",
        "question": "Myanmar nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "mm-capital-naypyidaw",
        "category": "capital",
        "vi": "Thủ đô của Myanmar là Naypyidaw.",
        "en": "The capital of Myanmar is Naypyidaw.",
        "question": "Thủ đô của Myanmar là thành phố nào?",
        "answers": [
          "Naypyidaw",
          "Yangon",
          "Mandalay",
          "Bagan"
        ]
      },
      {
        "id": "mm-geography-coast",
        "category": "geography",
        "vi": "Myanmar giáp Ấn Độ Dương.",
        "en": "Myanmar borders the Ấn Độ Dương.",
        "question": "Myanmar giáp biển hoặc đại dương nào?",
        "answers": [
          "Ấn Độ Dương",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "mm-landmarks-bagan",
        "category": "landmarks",
        "vi": "Bagan ở Myanmar có rất nhiều ngôi chùa và bảo tháp cổ.",
        "en": "Bagan in Myanmar has many ancient temples and pagodas.",
        "question": "Nơi có rất nhiều chùa cổ ở Myanmar tên là gì?",
        "answers": [
          "Bagan",
          "Kyoto",
          "Angkor",
          "Athens"
        ]
      }
    ]
  },
  {
    "id": "np",
    "isoCode": "NP",
    "name": "Nepal",
    "officialName": "Cộng hòa Dân chủ Liên bang Nepal",
    "nameEn": "Nepal",
    "officialNameEn": "Federal Democratic Republic of Nepal",
    "flag": "🇳🇵",
    "capital": "Kathmandu",
    "capitalEn": "Kathmandu",
    "continent": "asia",
    "region": "Nam Á",
    "subRegion": "Himalaya",
    "languages": [
      "ne"
    ],
    "currency": "Rupee",
    "neighbors": [
      "cn",
      "in"
    ],
    "geo": "landlocked",
    "landscape": "mountain",
    "flagColors": [
      "red",
      "blue"
    ],
    "altCities": [
      "Pokhara",
      "Lalitpur",
      "Bhaktapur"
    ],
    "facts": [
      {
        "id": "np-geography-continent",
        "category": "geography",
        "vi": "Nepal nằm ở Châu Á.",
        "en": "Nepal is in Asia.",
        "question": "Nepal nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "np-capital-kathmandu",
        "category": "capital",
        "vi": "Thủ đô của Nepal là Kathmandu.",
        "en": "The capital of Nepal is Kathmandu.",
        "question": "Thủ đô của Nepal là thành phố nào?",
        "answers": [
          "Kathmandu",
          "Pokhara",
          "Lalitpur",
          "Bhaktapur"
        ]
      },
      {
        "id": "np-geography-landlocked",
        "category": "geography",
        "vi": "Nepal không giáp biển.",
        "en": "Nepal is landlocked.",
        "question": "Điều nào đúng về Nepal?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "np-nature-everest",
        "category": "nature",
        "vi": "Núi Everest, ngọn núi cao nhất thế giới, nằm trên biên giới Nepal.",
        "en": "Mount Everest, the world's highest mountain, is on Nepal's border.",
        "question": "Ngọn núi cao nhất thế giới nằm ở biên giới Nepal tên là gì?",
        "answers": [
          "Núi Everest",
          "Núi Phú Sĩ",
          "Núi Kilimanjaro",
          "Núi Alps"
        ]
      }
    ]
  },
  {
    "id": "kp",
    "isoCode": "KP",
    "name": "Triều Tiên",
    "officialName": "Cộng hòa Dân chủ Nhân dân Triều Tiên",
    "nameEn": "North Korea",
    "officialNameEn": "Democratic People's Republic of Korea",
    "flag": "🇰🇵",
    "capital": "Bình Nhưỡng",
    "capitalEn": "Pyongyang",
    "continent": "asia",
    "region": "Đông Á",
    "subRegion": "Bán đảo Triều Tiên",
    "languages": [
      "ko"
    ],
    "currency": "Won",
    "neighbors": [
      "cn",
      "ru",
      "kr"
    ],
    "geo": "coastal",
    "landscape": "temperate",
    "flagColors": [
      "red",
      "blue",
      "white"
    ],
    "altCities": [
      "Kaesong",
      "Wonsan",
      "Chongjin"
    ],
    "facts": [
      {
        "id": "kp-geography-continent",
        "category": "geography",
        "vi": "Triều Tiên nằm ở Châu Á.",
        "en": "North Korea is in Asia.",
        "question": "Triều Tiên nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "kp-capital-pyongyang",
        "category": "capital",
        "vi": "Thủ đô của Triều Tiên là Bình Nhưỡng.",
        "en": "The capital of North Korea is Pyongyang.",
        "question": "Thủ đô của Triều Tiên là thành phố nào?",
        "answers": [
          "Bình Nhưỡng",
          "Kaesong",
          "Wonsan",
          "Chongjin"
        ]
      },
      {
        "id": "kp-geography-coast",
        "category": "geography",
        "vi": "Triều Tiên giáp Biển Nhật Bản.",
        "en": "North Korea borders the Biển Nhật Bản.",
        "question": "Triều Tiên giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Nhật Bản",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "kp-geography-peninsula",
        "category": "geography",
        "vi": "Triều Tiên nằm ở phía bắc bán đảo Triều Tiên.",
        "en": "North Korea is in the north of the Korean Peninsula.",
        "question": "Triều Tiên nằm ở phần nào của bán đảo Triều Tiên?",
        "answers": [
          "Phía bắc",
          "Phía nam Úc",
          "Giữa châu Âu",
          "Trên đảo Madagascar"
        ]
      }
    ]
  },
  {
    "id": "kr",
    "isoCode": "KR",
    "name": "Hàn Quốc",
    "officialName": "Đại Hàn Dân Quốc",
    "nameEn": "South Korea",
    "officialNameEn": "Republic of Korea",
    "flag": "🇰🇷",
    "capital": "Seoul",
    "capitalEn": "Seoul",
    "continent": "asia",
    "region": "Đông Á",
    "subRegion": "Bán đảo Triều Tiên",
    "languages": [
      "ko"
    ],
    "currency": "Won",
    "neighbors": [
      "kp"
    ],
    "geo": "coastal",
    "landscape": "temperate",
    "flagColors": [
      "white",
      "red",
      "blue",
      "black"
    ],
    "altCities": [
      "Busan",
      "Incheon",
      "Daegu",
      "Jeju"
    ],
    "facts": [
      {
        "id": "kr-geography-continent",
        "category": "geography",
        "vi": "Hàn Quốc nằm ở Châu Á.",
        "en": "South Korea is in Asia.",
        "question": "Hàn Quốc nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "kr-capital-seoul",
        "category": "capital",
        "vi": "Thủ đô của Hàn Quốc là Seoul.",
        "en": "The capital of South Korea is Seoul.",
        "question": "Thủ đô của Hàn Quốc là thành phố nào?",
        "answers": [
          "Seoul",
          "Busan",
          "Incheon",
          "Daegu"
        ]
      },
      {
        "id": "kr-geography-coast",
        "category": "geography",
        "vi": "Hàn Quốc giáp Biển Hoàng Hải.",
        "en": "South Korea borders the Biển Hoàng Hải.",
        "question": "Hàn Quốc giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Hoàng Hải",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "kr-food-kimchi",
        "category": "food",
        "vi": "Kimchi là món cải muối nổi tiếng của Hàn Quốc.",
        "en": "Kimchi is a famous Korean fermented vegetable dish.",
        "question": "Món cải muối nổi tiếng của Hàn Quốc là gì?",
        "answers": [
          "Kimchi",
          "Sushi",
          "Phở",
          "Pizza"
        ]
      }
    ]
  },
  {
    "id": "om",
    "isoCode": "OM",
    "name": "Oman",
    "officialName": "Sultanate Oman",
    "nameEn": "Oman",
    "officialNameEn": "Sultanate of Oman",
    "flag": "🇴🇲",
    "capital": "Muscat",
    "capitalEn": "Muscat",
    "continent": "asia",
    "region": "Tây Á",
    "subRegion": "Bán đảo Ả Rập",
    "languages": [
      "ar"
    ],
    "currency": "Rial",
    "neighbors": [
      "sa",
      "ae",
      "ye"
    ],
    "geo": "coastal",
    "landscape": "desert",
    "flagColors": [
      "red",
      "white",
      "green"
    ],
    "altCities": [
      "Salalah",
      "Sohar",
      "Nizwa"
    ],
    "facts": [
      {
        "id": "om-geography-continent",
        "category": "geography",
        "vi": "Oman nằm ở Châu Á.",
        "en": "Oman is in Asia.",
        "question": "Oman nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "om-capital-muscat",
        "category": "capital",
        "vi": "Thủ đô của Oman là Muscat.",
        "en": "The capital of Oman is Muscat.",
        "question": "Thủ đô của Oman là thành phố nào?",
        "answers": [
          "Muscat",
          "Salalah",
          "Sohar",
          "Nizwa"
        ]
      },
      {
        "id": "om-geography-coast",
        "category": "geography",
        "vi": "Oman giáp Ấn Độ Dương.",
        "en": "Oman borders the Ấn Độ Dương.",
        "question": "Oman giáp biển hoặc đại dương nào?",
        "answers": [
          "Ấn Độ Dương",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "om-language-ar",
        "category": "language",
        "vi": "Người dân Oman nói tiếng Ả Rập.",
        "en": "People in Oman speak tiếng Ả Rập.",
        "question": "Người dân Oman nói ngôn ngữ nào?",
        "answers": [
          "tiếng Ả Rập",
          "tiếng Việt",
          "tiếng Nhật",
          "tiếng Inuit"
        ]
      }
    ]
  },
  {
    "id": "pk",
    "isoCode": "PK",
    "name": "Pakistan",
    "officialName": "Cộng hòa Hồi giáo Pakistan",
    "nameEn": "Pakistan",
    "officialNameEn": "Islamic Republic of Pakistan",
    "flag": "🇵🇰",
    "capital": "Islamabad",
    "capitalEn": "Islamabad",
    "continent": "asia",
    "region": "Nam Á",
    "subRegion": "Tiểu lục địa Ấn Độ",
    "languages": [
      "ur",
      "en"
    ],
    "currency": "Rupee",
    "neighbors": [
      "ir",
      "af",
      "cn",
      "in"
    ],
    "geo": "coastal",
    "landscape": "mountain",
    "flagColors": [
      "green",
      "white"
    ],
    "altCities": [
      "Karachi",
      "Lahore",
      "Peshawar"
    ],
    "facts": [
      {
        "id": "pk-geography-continent",
        "category": "geography",
        "vi": "Pakistan nằm ở Châu Á.",
        "en": "Pakistan is in Asia.",
        "question": "Pakistan nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "pk-capital-islamabad",
        "category": "capital",
        "vi": "Thủ đô của Pakistan là Islamabad.",
        "en": "The capital of Pakistan is Islamabad.",
        "question": "Thủ đô của Pakistan là thành phố nào?",
        "answers": [
          "Islamabad",
          "Karachi",
          "Lahore",
          "Peshawar"
        ]
      },
      {
        "id": "pk-geography-coast",
        "category": "geography",
        "vi": "Pakistan giáp Ấn Độ Dương.",
        "en": "Pakistan borders the Ấn Độ Dương.",
        "question": "Pakistan giáp biển hoặc đại dương nào?",
        "answers": [
          "Ấn Độ Dương",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "pk-nature-k2",
        "category": "nature",
        "vi": "Đỉnh K2, một trong những núi cao nhất thế giới, nằm ở Pakistan.",
        "en": "K2, one of the world's highest peaks, is in Pakistan.",
        "question": "Ngọn núi rất cao ở Pakistan tên là gì?",
        "answers": [
          "K2",
          "Núi Phú Sĩ",
          "Núi Kilimanjaro",
          "Núi Bàn"
        ]
      }
    ]
  },
  {
    "id": "ps",
    "isoCode": "PS",
    "name": "Palestine",
    "officialName": "Palestine",
    "nameEn": "Palestine",
    "officialNameEn": "State of Palestine",
    "flag": "🇵🇸",
    "capital": "Ramallah",
    "capitalEn": "Ramallah",
    "continent": "asia",
    "region": "Tây Á",
    "subRegion": "Đông Địa Trung Hải",
    "languages": [
      "ar"
    ],
    "currency": "Đô la / Shekel",
    "neighbors": [
      "il",
      "eg",
      "jo"
    ],
    "geo": "coastal",
    "landscape": "temperate",
    "flagColors": [
      "black",
      "white",
      "green",
      "red"
    ],
    "altCities": [
      "Nablus",
      "Hebron",
      "Gaza",
      "Bethlehem"
    ],
    "facts": [
      {
        "id": "ps-geography-continent",
        "category": "geography",
        "vi": "Palestine nằm ở Châu Á.",
        "en": "Palestine is in Asia.",
        "question": "Palestine nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "ps-capital-ramallah",
        "category": "capital",
        "vi": "Thủ đô của Palestine là Ramallah.",
        "en": "The capital of Palestine is Ramallah.",
        "question": "Thủ đô của Palestine là thành phố nào?",
        "answers": [
          "Ramallah",
          "Nablus",
          "Hebron",
          "Gaza"
        ]
      },
      {
        "id": "ps-geography-coast",
        "category": "geography",
        "vi": "Palestine giáp Địa Trung Hải.",
        "en": "Palestine borders the Địa Trung Hải.",
        "question": "Palestine giáp biển hoặc đại dương nào?",
        "answers": [
          "Địa Trung Hải",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "ps-nature-olive",
        "category": "nature",
        "vi": "Palestine có nhiều cây ô-liu xanh trên đồi.",
        "en": "Palestine has many olive trees on the hills.",
        "question": "Loại cây xanh phổ biến trên đồi ở Palestine là gì?",
        "answers": [
          "Cây ô-liu",
          "Cây dừa",
          "Cây thông",
          "Cây tre"
        ]
      },
      {
        "id": "ps-geography-med",
        "category": "geography",
        "vi": "Dải Gaza của Palestine giáp Địa Trung Hải.",
        "en": "The Gaza Strip of Palestine meets the Mediterranean Sea.",
        "question": "Palestine giáp biển nào ở phía tây?",
        "answers": [
          "Địa Trung Hải",
          "Biển Đỏ",
          "Biển Baltic",
          "Thái Bình Dương"
        ]
      }
    ]
  },
  {
    "id": "ph",
    "isoCode": "PH",
    "name": "Philippines",
    "officialName": "Cộng hòa Philippines",
    "nameEn": "Philippines",
    "officialNameEn": "Republic of the Philippines",
    "flag": "🇵🇭",
    "capital": "Manila",
    "capitalEn": "Manila",
    "continent": "asia",
    "region": "Đông Nam Á",
    "subRegion": "Quần đảo Philippines",
    "languages": [
      "fil",
      "en"
    ],
    "currency": "Peso",
    "neighbors": [],
    "geo": "island",
    "landscape": "tropical",
    "flagColors": [
      "blue",
      "red",
      "white",
      "yellow"
    ],
    "altCities": [
      "Quezon City",
      "Cebu",
      "Davao",
      "Baguio"
    ],
    "facts": [
      {
        "id": "ph-geography-continent",
        "category": "geography",
        "vi": "Philippines nằm ở Châu Á.",
        "en": "Philippines is in Asia.",
        "question": "Philippines nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "ph-capital-manila",
        "category": "capital",
        "vi": "Thủ đô của Philippines là Manila.",
        "en": "The capital of Philippines is Manila.",
        "question": "Thủ đô của Philippines là thành phố nào?",
        "answers": [
          "Manila",
          "Quezon City",
          "Cebu",
          "Davao"
        ]
      },
      {
        "id": "ph-geography-island",
        "category": "geography",
        "vi": "Philippines là một quốc gia đảo.",
        "en": "Philippines is an island country.",
        "question": "Điều nào đúng về Philippines?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "ph-geography-islands",
        "category": "geography",
        "vi": "Philippines là quốc gia gồm hàng nghìn hòn đảo.",
        "en": "The Philippines is a country of thousands of islands.",
        "question": "Philippines gồm rất nhiều thứ gì?",
        "answers": [
          "Hòn đảo",
          "Sa mạc",
          "Sông băng",
          "Thảo nguyên"
        ]
      }
    ]
  },
  {
    "id": "qa",
    "isoCode": "QA",
    "name": "Qatar",
    "officialName": "Nhà nước Qatar",
    "nameEn": "Qatar",
    "officialNameEn": "State of Qatar",
    "flag": "🇶🇦",
    "capital": "Doha",
    "capitalEn": "Doha",
    "continent": "asia",
    "region": "Tây Á",
    "subRegion": "Bán đảo Ả Rập",
    "languages": [
      "ar"
    ],
    "currency": "Riyal",
    "neighbors": [
      "sa"
    ],
    "geo": "coastal",
    "landscape": "desert",
    "flagColors": [
      "maroon",
      "white"
    ],
    "altCities": [
      "Al Wakrah",
      "Al Khor"
    ],
    "facts": [
      {
        "id": "qa-geography-continent",
        "category": "geography",
        "vi": "Qatar nằm ở Châu Á.",
        "en": "Qatar is in Asia.",
        "question": "Qatar nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "qa-capital-doha",
        "category": "capital",
        "vi": "Thủ đô của Qatar là Doha.",
        "en": "The capital of Qatar is Doha.",
        "question": "Thủ đô của Qatar là thành phố nào?",
        "answers": [
          "Doha",
          "Al Wakrah",
          "Al Khor",
          "Paris"
        ]
      },
      {
        "id": "qa-geography-coast",
        "category": "geography",
        "vi": "Qatar giáp Vịnh Ba Tư.",
        "en": "Qatar borders the Vịnh Ba Tư.",
        "question": "Qatar giáp biển hoặc đại dương nào?",
        "answers": [
          "Vịnh Ba Tư",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "qa-geography-peninsula",
        "category": "geography",
        "vi": "Qatar là một bán đảo nhỏ trên Vịnh Ba Tư.",
        "en": "Qatar is a small peninsula on the Persian Gulf.",
        "question": "Qatar có dạng đất nào?",
        "answers": [
          "Bán đảo",
          "Quần đảo băng",
          "Quốc gia không giáp biển",
          "Lục địa Úc"
        ]
      }
    ]
  },
  {
    "id": "sa",
    "isoCode": "SA",
    "name": "Ả Rập Xê-út",
    "officialName": "Vương quốc Ả Rập Xê-út",
    "nameEn": "Saudi Arabia",
    "officialNameEn": "Kingdom of Saudi Arabia",
    "flag": "🇸🇦",
    "capital": "Riyadh",
    "capitalEn": "Riyadh",
    "continent": "asia",
    "region": "Tây Á",
    "subRegion": "Bán đảo Ả Rập",
    "languages": [
      "ar"
    ],
    "currency": "Riyal",
    "neighbors": [
      "jo",
      "iq",
      "kw",
      "qa",
      "ae",
      "om",
      "ye"
    ],
    "geo": "coastal",
    "landscape": "desert",
    "flagColors": [
      "green",
      "white"
    ],
    "altCities": [
      "Jeddah",
      "Mecca",
      "Medina",
      "Dammam"
    ],
    "facts": [
      {
        "id": "sa-geography-continent",
        "category": "geography",
        "vi": "Ả Rập Xê-út nằm ở Châu Á.",
        "en": "Saudi Arabia is in Asia.",
        "question": "Ả Rập Xê-út nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "sa-capital-riyadh",
        "category": "capital",
        "vi": "Thủ đô của Ả Rập Xê-út là Riyadh.",
        "en": "The capital of Saudi Arabia is Riyadh.",
        "question": "Thủ đô của Ả Rập Xê-út là thành phố nào?",
        "answers": [
          "Riyadh",
          "Jeddah",
          "Mecca",
          "Medina"
        ]
      },
      {
        "id": "sa-geography-coast",
        "category": "geography",
        "vi": "Ả Rập Xê-út giáp Biển Đỏ.",
        "en": "Saudi Arabia borders the Biển Đỏ.",
        "question": "Ả Rập Xê-út giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Đỏ",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "sa-animals-camel",
        "category": "animals",
        "vi": "Lạc đà sống trên sa mạc Ả Rập Xê-út.",
        "en": "Camels live in the deserts of Saudi Arabia.",
        "question": "Con vật sống trên sa mạc Ả Rập Xê-út là gì?",
        "answers": [
          "Lạc đà",
          "Chim cánh cụt",
          "Gấu trúc",
          "Kanguru"
        ]
      }
    ]
  },
  {
    "id": "sg",
    "isoCode": "SG",
    "name": "Singapore",
    "officialName": "Cộng hòa Singapore",
    "nameEn": "Singapore",
    "officialNameEn": "Republic of Singapore",
    "flag": "🇸🇬",
    "capital": "Singapore",
    "capitalEn": "Singapore",
    "continent": "asia",
    "region": "Đông Nam Á",
    "subRegion": "Đảo Singapore",
    "languages": [
      "en",
      "ms",
      "zh",
      "ta"
    ],
    "currency": "Đô la Singapore",
    "neighbors": [],
    "geo": "island",
    "landscape": "city",
    "flagColors": [
      "red",
      "white"
    ],
    "altCities": [
      "Jurong",
      "Woodlands",
      "Tampines"
    ],
    "facts": [
      {
        "id": "sg-geography-continent",
        "category": "geography",
        "vi": "Singapore nằm ở Châu Á.",
        "en": "Singapore is in Asia.",
        "question": "Singapore nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "sg-capital-singapore",
        "category": "capital",
        "vi": "Thủ đô của Singapore là Singapore.",
        "en": "The capital of Singapore is Singapore.",
        "question": "Thủ đô của Singapore là thành phố nào?",
        "answers": [
          "Singapore",
          "Jurong",
          "Woodlands",
          "Tampines"
        ]
      },
      {
        "id": "sg-geography-island",
        "category": "geography",
        "vi": "Singapore là một quốc gia đảo.",
        "en": "Singapore is an island country.",
        "question": "Điều nào đúng về Singapore?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "sg-geography-city",
        "category": "geography",
        "vi": "Singapore là một quốc gia thành phố trên đảo.",
        "en": "Singapore is a city-state on an island.",
        "question": "Singapore là quốc gia thuộc loại nào?",
        "answers": [
          "Quốc gia thành phố trên đảo",
          "Quốc gia không giáp biển",
          "Quốc gia ở Bắc Cực",
          "Quốc gia trên sa mạc"
        ]
      }
    ]
  },
  {
    "id": "lk",
    "isoCode": "LK",
    "name": "Sri Lanka",
    "officialName": "Cộng hòa Xã hội chủ nghĩa Dân chủ Sri Lanka",
    "nameEn": "Sri Lanka",
    "officialNameEn": "Democratic Socialist Republic of Sri Lanka",
    "flag": "🇱🇰",
    "capital": "Colombo",
    "capitalEn": "Colombo",
    "continent": "asia",
    "region": "Nam Á",
    "subRegion": "Ấn Độ Dương",
    "languages": [
      "si",
      "ta"
    ],
    "currency": "Rupee",
    "neighbors": [],
    "geo": "island",
    "landscape": "tropical",
    "flagColors": [
      "yellow",
      "green",
      "orange",
      "red"
    ],
    "altCities": [
      "Kandy",
      "Galle",
      "Jaffna"
    ],
    "facts": [
      {
        "id": "lk-geography-continent",
        "category": "geography",
        "vi": "Sri Lanka nằm ở Châu Á.",
        "en": "Sri Lanka is in Asia.",
        "question": "Sri Lanka nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "lk-capital-colombo",
        "category": "capital",
        "vi": "Thủ đô của Sri Lanka là Colombo.",
        "en": "The capital of Sri Lanka is Colombo.",
        "question": "Thủ đô của Sri Lanka là thành phố nào?",
        "answers": [
          "Colombo",
          "Kandy",
          "Galle",
          "Jaffna"
        ]
      },
      {
        "id": "lk-geography-island",
        "category": "geography",
        "vi": "Sri Lanka là một quốc gia đảo.",
        "en": "Sri Lanka is an island country.",
        "question": "Điều nào đúng về Sri Lanka?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "lk-food-tea",
        "category": "food",
        "vi": "Sri Lanka nổi tiếng với những đồi chè xanh.",
        "en": "Sri Lanka is famous for green tea hills.",
        "question": "Sri Lanka nổi tiếng với cây gì trên đồi?",
        "answers": [
          "Chè",
          "Cà phê",
          "Lúa mì",
          "Nho"
        ]
      }
    ]
  },
  {
    "id": "sy",
    "isoCode": "SY",
    "name": "Syria",
    "officialName": "Cộng hòa Ả Rập Syria",
    "nameEn": "Syria",
    "officialNameEn": "Syrian Arab Republic",
    "flag": "🇸🇾",
    "capital": "Damascus",
    "capitalEn": "Damascus",
    "continent": "asia",
    "region": "Tây Á",
    "subRegion": "Levant",
    "languages": [
      "ar"
    ],
    "currency": "Bảng Syria",
    "neighbors": [
      "tr",
      "iq",
      "jo",
      "il",
      "lb"
    ],
    "geo": "coastal",
    "landscape": "temperate",
    "flagColors": [
      "red",
      "white",
      "black"
    ],
    "altCities": [
      "Aleppo",
      "Homs",
      "Latakia"
    ],
    "facts": [
      {
        "id": "sy-geography-continent",
        "category": "geography",
        "vi": "Syria nằm ở Châu Á.",
        "en": "Syria is in Asia.",
        "question": "Syria nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "sy-capital-damascus",
        "category": "capital",
        "vi": "Thủ đô của Syria là Damascus.",
        "en": "The capital of Syria is Damascus.",
        "question": "Thủ đô của Syria là thành phố nào?",
        "answers": [
          "Damascus",
          "Aleppo",
          "Homs",
          "Latakia"
        ]
      },
      {
        "id": "sy-geography-coast",
        "category": "geography",
        "vi": "Syria giáp Địa Trung Hải.",
        "en": "Syria borders the Địa Trung Hải.",
        "question": "Syria giáp biển hoặc đại dương nào?",
        "answers": [
          "Địa Trung Hải",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "sy-geography-med",
        "category": "geography",
        "vi": "Syria có một đoạn bờ Địa Trung Hải.",
        "en": "Syria has a stretch of Mediterranean coast.",
        "question": "Syria giáp biển nào ở phía tây?",
        "answers": [
          "Địa Trung Hải",
          "Biển Baltic",
          "Thái Bình Dương",
          "Biển Caribe"
        ]
      }
    ]
  },
  {
    "id": "tj",
    "isoCode": "TJ",
    "name": "Tajikistan",
    "officialName": "Cộng hòa Tajikistan",
    "nameEn": "Tajikistan",
    "officialNameEn": "Republic of Tajikistan",
    "flag": "🇹🇯",
    "capital": "Dushanbe",
    "capitalEn": "Dushanbe",
    "continent": "asia",
    "region": "Trung Á",
    "subRegion": "Pamir",
    "languages": [
      "tg"
    ],
    "currency": "Somoni",
    "neighbors": [
      "uz",
      "kg",
      "cn",
      "af"
    ],
    "geo": "landlocked",
    "landscape": "mountain",
    "flagColors": [
      "red",
      "white",
      "green"
    ],
    "altCities": [
      "Khujand",
      "Kulob"
    ],
    "facts": [
      {
        "id": "tj-geography-continent",
        "category": "geography",
        "vi": "Tajikistan nằm ở Châu Á.",
        "en": "Tajikistan is in Asia.",
        "question": "Tajikistan nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "tj-capital-dushanbe",
        "category": "capital",
        "vi": "Thủ đô của Tajikistan là Dushanbe.",
        "en": "The capital of Tajikistan is Dushanbe.",
        "question": "Thủ đô của Tajikistan là thành phố nào?",
        "answers": [
          "Dushanbe",
          "Khujand",
          "Kulob",
          "Paris"
        ]
      },
      {
        "id": "tj-geography-landlocked",
        "category": "geography",
        "vi": "Tajikistan không giáp biển.",
        "en": "Tajikistan is landlocked.",
        "question": "Điều nào đúng về Tajikistan?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "tj-nature-pamir",
        "category": "nature",
        "vi": "Cao nguyên Pamir nằm ở Tajikistan.",
        "en": "The Pamir highlands are in Tajikistan.",
        "question": "Cao nguyên núi nổi tiếng ở Tajikistan tên là gì?",
        "answers": [
          "Pamir",
          "Alps",
          "Atlas",
          "Drakensberg"
        ]
      }
    ]
  },
  {
    "id": "th",
    "isoCode": "TH",
    "name": "Thái Lan",
    "officialName": "Vương quốc Thái Lan",
    "nameEn": "Thailand",
    "officialNameEn": "Kingdom of Thailand",
    "flag": "🇹🇭",
    "capital": "Bangkok",
    "capitalEn": "Bangkok",
    "continent": "asia",
    "region": "Đông Nam Á",
    "subRegion": "Đông Dương",
    "languages": [
      "th"
    ],
    "currency": "Baht",
    "neighbors": [
      "mm",
      "la",
      "kh",
      "my"
    ],
    "geo": "coastal",
    "landscape": "tropical",
    "flagColors": [
      "red",
      "white",
      "blue"
    ],
    "altCities": [
      "Chiang Mai",
      "Phuket",
      "Pattaya",
      "Khon Kaen"
    ],
    "facts": [
      {
        "id": "th-geography-continent",
        "category": "geography",
        "vi": "Thái Lan nằm ở Châu Á.",
        "en": "Thailand is in Asia.",
        "question": "Thái Lan nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "th-capital-bangkok",
        "category": "capital",
        "vi": "Thủ đô của Thái Lan là Bangkok.",
        "en": "The capital of Thailand is Bangkok.",
        "question": "Thủ đô của Thái Lan là thành phố nào?",
        "answers": [
          "Bangkok",
          "Chiang Mai",
          "Phuket",
          "Pattaya"
        ]
      },
      {
        "id": "th-geography-coast",
        "category": "geography",
        "vi": "Thái Lan giáp Vịnh Thái Lan.",
        "en": "Thailand borders the Vịnh Thái Lan.",
        "question": "Thái Lan giáp biển hoặc đại dương nào?",
        "answers": [
          "Vịnh Thái Lan",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "th-animals-elephant",
        "category": "animals",
        "vi": "Voi là con vật được yêu quý ở Thái Lan.",
        "en": "Elephants are cherished animals in Thailand.",
        "question": "Con vật lớn được yêu quý ở Thái Lan là gì?",
        "answers": [
          "Voi",
          "Gấu trúc",
          "Kanguru",
          "Lạc đà"
        ]
      }
    ]
  },
  {
    "id": "tl",
    "isoCode": "TL",
    "name": "Đông Timor",
    "officialName": "Cộng hòa Dân chủ Timor-Leste",
    "nameEn": "East Timor",
    "officialNameEn": "Democratic Republic of Timor-Leste",
    "flag": "🇹🇱",
    "capital": "Dili",
    "capitalEn": "Dili",
    "continent": "asia",
    "region": "Đông Nam Á",
    "subRegion": "Đảo Timor",
    "languages": [
      "tl",
      "pt"
    ],
    "currency": "Đô la Mỹ",
    "neighbors": [
      "id"
    ],
    "geo": "island",
    "landscape": "tropical",
    "flagColors": [
      "red",
      "yellow",
      "black"
    ],
    "altCities": [
      "Baucau",
      "Maliana"
    ],
    "facts": [
      {
        "id": "tl-geography-continent",
        "category": "geography",
        "vi": "Đông Timor nằm ở Châu Á.",
        "en": "East Timor is in Asia.",
        "question": "Đông Timor nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "tl-capital-dili",
        "category": "capital",
        "vi": "Thủ đô của Đông Timor là Dili.",
        "en": "The capital of East Timor is Dili.",
        "question": "Thủ đô của Đông Timor là thành phố nào?",
        "answers": [
          "Dili",
          "Baucau",
          "Maliana",
          "Paris"
        ]
      },
      {
        "id": "tl-geography-island",
        "category": "geography",
        "vi": "Đông Timor là một quốc gia đảo.",
        "en": "East Timor is an island country.",
        "question": "Điều nào đúng về Đông Timor?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "tl-language-tl",
        "category": "language",
        "vi": "Người dân Đông Timor nói tiếng Tetum.",
        "en": "People in East Timor speak tiếng Tetum.",
        "question": "Người dân Đông Timor nói ngôn ngữ nào?",
        "answers": [
          "tiếng Tetum",
          "tiếng Việt",
          "tiếng Nhật",
          "tiếng Inuit"
        ]
      }
    ]
  },
  {
    "id": "tr",
    "isoCode": "TR",
    "name": "Thổ Nhĩ Kỳ",
    "officialName": "Cộng hòa Thổ Nhĩ Kỳ",
    "nameEn": "Türkiye",
    "officialNameEn": "Republic of Türkiye",
    "flag": "🇹🇷",
    "capital": "Ankara",
    "capitalEn": "Ankara",
    "continent": "asia",
    "region": "Tây Á",
    "subRegion": "Tiểu Á",
    "languages": [
      "tr"
    ],
    "currency": "Lira",
    "neighbors": [
      "ge",
      "am",
      "ir",
      "iq",
      "sy",
      "gr",
      "bg"
    ],
    "geo": "coastal",
    "landscape": "temperate",
    "flagColors": [
      "red",
      "white"
    ],
    "altCities": [
      "Istanbul",
      "Izmir",
      "Antalya",
      "Bursa"
    ],
    "facts": [
      {
        "id": "tr-geography-continent",
        "category": "geography",
        "vi": "Thổ Nhĩ Kỳ nằm ở Châu Á.",
        "en": "Türkiye is in Asia.",
        "question": "Thổ Nhĩ Kỳ nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "tr-capital-ankara",
        "category": "capital",
        "vi": "Thủ đô của Thổ Nhĩ Kỳ là Ankara.",
        "en": "The capital of Türkiye is Ankara.",
        "question": "Thủ đô của Thổ Nhĩ Kỳ là thành phố nào?",
        "answers": [
          "Ankara",
          "Istanbul",
          "Izmir",
          "Antalya"
        ]
      },
      {
        "id": "tr-geography-coast",
        "category": "geography",
        "vi": "Thổ Nhĩ Kỳ giáp Địa Trung Hải.",
        "en": "Türkiye borders the Địa Trung Hải.",
        "question": "Thổ Nhĩ Kỳ giáp biển hoặc đại dương nào?",
        "answers": [
          "Địa Trung Hải",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "tr-geography-istanbul",
        "category": "geography",
        "vi": "Thành phố Istanbul của Thổ Nhĩ Kỳ nằm ở cả châu Á và châu Âu.",
        "en": "Istanbul in Türkiye sits on both Asia and Europe.",
        "question": "Thành phố nào của Thổ Nhĩ Kỳ nằm ở cả châu Á và châu Âu?",
        "answers": [
          "Istanbul",
          "Ankara",
          "Tokyo",
          "Cairo"
        ]
      }
    ]
  },
  {
    "id": "tm",
    "isoCode": "TM",
    "name": "Turkmenistan",
    "officialName": "Turkmenistan",
    "nameEn": "Turkmenistan",
    "officialNameEn": "Turkmenistan",
    "flag": "🇹🇲",
    "capital": "Ashgabat",
    "capitalEn": "Ashgabat",
    "continent": "asia",
    "region": "Trung Á",
    "subRegion": "Sa mạc Karakum",
    "languages": [
      "tk"
    ],
    "currency": "Manat",
    "neighbors": [
      "kz",
      "uz",
      "af",
      "ir"
    ],
    "geo": "landlocked",
    "landscape": "desert",
    "flagColors": [
      "green",
      "white",
      "red"
    ],
    "altCities": [
      "Turkmenabat",
      "Dashoguz"
    ],
    "facts": [
      {
        "id": "tm-geography-continent",
        "category": "geography",
        "vi": "Turkmenistan nằm ở Châu Á.",
        "en": "Turkmenistan is in Asia.",
        "question": "Turkmenistan nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "tm-capital-ashgabat",
        "category": "capital",
        "vi": "Thủ đô của Turkmenistan là Ashgabat.",
        "en": "The capital of Turkmenistan is Ashgabat.",
        "question": "Thủ đô của Turkmenistan là thành phố nào?",
        "answers": [
          "Ashgabat",
          "Turkmenabat",
          "Dashoguz",
          "Paris"
        ]
      },
      {
        "id": "tm-geography-landlocked",
        "category": "geography",
        "vi": "Turkmenistan không giáp biển.",
        "en": "Turkmenistan is landlocked.",
        "question": "Điều nào đúng về Turkmenistan?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "tm-nature-karakum",
        "category": "nature",
        "vi": "Sa mạc Karakum phủ phần lớn Turkmenistan.",
        "en": "The Karakum Desert covers much of Turkmenistan.",
        "question": "Sa mạc lớn ở Turkmenistan tên là gì?",
        "answers": [
          "Karakum",
          "Sahara",
          "Gobi",
          "Namib"
        ]
      }
    ]
  },
  {
    "id": "ae",
    "isoCode": "AE",
    "name": "UAE",
    "officialName": "Các Tiểu vương quốc Ả Rập Thống nhất",
    "nameEn": "United Arab Emirates",
    "officialNameEn": "United Arab Emirates",
    "flag": "🇦🇪",
    "capital": "Abu Dhabi",
    "capitalEn": "Abu Dhabi",
    "continent": "asia",
    "region": "Tây Á",
    "subRegion": "Bán đảo Ả Rập",
    "languages": [
      "ar"
    ],
    "currency": "Dirham",
    "neighbors": [
      "sa",
      "om"
    ],
    "geo": "coastal",
    "landscape": "desert",
    "flagColors": [
      "red",
      "green",
      "white",
      "black"
    ],
    "altCities": [
      "Dubai",
      "Sharjah",
      "Ajman"
    ],
    "facts": [
      {
        "id": "ae-geography-continent",
        "category": "geography",
        "vi": "UAE nằm ở Châu Á.",
        "en": "United Arab Emirates is in Asia.",
        "question": "UAE nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "ae-capital-abu-dhabi",
        "category": "capital",
        "vi": "Thủ đô của UAE là Abu Dhabi.",
        "en": "The capital of United Arab Emirates is Abu Dhabi.",
        "question": "Thủ đô của UAE là thành phố nào?",
        "answers": [
          "Abu Dhabi",
          "Dubai",
          "Sharjah",
          "Ajman"
        ]
      },
      {
        "id": "ae-geography-coast",
        "category": "geography",
        "vi": "UAE giáp Vịnh Ba Tư.",
        "en": "United Arab Emirates borders the Vịnh Ba Tư.",
        "question": "UAE giáp biển hoặc đại dương nào?",
        "answers": [
          "Vịnh Ba Tư",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "ae-landmarks-burj",
        "category": "landmarks",
        "vi": "Tòa tháp Burj Khalifa ở Dubai là một trong những tòa nhà cao nhất thế giới.",
        "en": "The Burj Khalifa in Dubai is one of the world's tallest buildings.",
        "question": "Tòa nhà rất cao ở Dubai tên là gì?",
        "answers": [
          "Burj Khalifa",
          "Tháp Eiffel",
          "Big Ben",
          "Colosseum"
        ]
      }
    ]
  },
  {
    "id": "uz",
    "isoCode": "UZ",
    "name": "Uzbekistan",
    "officialName": "Cộng hòa Uzbekistan",
    "nameEn": "Uzbekistan",
    "officialNameEn": "Republic of Uzbekistan",
    "flag": "🇺🇿",
    "capital": "Tashkent",
    "capitalEn": "Tashkent",
    "continent": "asia",
    "region": "Trung Á",
    "subRegion": "Trung Á",
    "languages": [
      "uz"
    ],
    "currency": "Som",
    "neighbors": [
      "kz",
      "kg",
      "tj",
      "af",
      "tm"
    ],
    "geo": "landlocked",
    "landscape": "desert",
    "flagColors": [
      "blue",
      "white",
      "green"
    ],
    "altCities": [
      "Samarkand",
      "Bukhara",
      "Namangan"
    ],
    "facts": [
      {
        "id": "uz-geography-continent",
        "category": "geography",
        "vi": "Uzbekistan nằm ở Châu Á.",
        "en": "Uzbekistan is in Asia.",
        "question": "Uzbekistan nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "uz-capital-tashkent",
        "category": "capital",
        "vi": "Thủ đô của Uzbekistan là Tashkent.",
        "en": "The capital of Uzbekistan is Tashkent.",
        "question": "Thủ đô của Uzbekistan là thành phố nào?",
        "answers": [
          "Tashkent",
          "Samarkand",
          "Bukhara",
          "Namangan"
        ]
      },
      {
        "id": "uz-geography-landlocked",
        "category": "geography",
        "vi": "Uzbekistan không giáp biển.",
        "en": "Uzbekistan is landlocked.",
        "question": "Điều nào đúng về Uzbekistan?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "uz-landmarks-samarkand",
        "category": "landmarks",
        "vi": "Samarkand là thành phố cổ nổi tiếng trên Con đường Tơ lụa ở Uzbekistan.",
        "en": "Samarkand is a famous old Silk Road city in Uzbekistan.",
        "question": "Thành phố cổ trên Con đường Tơ lụa ở Uzbekistan tên là gì?",
        "answers": [
          "Samarkand",
          "Paris",
          "Tokyo",
          "Cairo"
        ]
      }
    ]
  },
  {
    "id": "vn",
    "isoCode": "VN",
    "name": "Việt Nam",
    "officialName": "Cộng hòa Xã hội chủ nghĩa Việt Nam",
    "nameEn": "Vietnam",
    "officialNameEn": "Socialist Republic of Viet Nam",
    "flag": "🇻🇳",
    "capital": "Hà Nội",
    "capitalEn": "Hanoi",
    "continent": "asia",
    "region": "Đông Nam Á",
    "subRegion": "Đông Dương",
    "languages": [
      "vi"
    ],
    "currency": "Đồng",
    "neighbors": [
      "cn",
      "la",
      "kh"
    ],
    "geo": "coastal",
    "landscape": "tropical",
    "flagColors": [
      "red",
      "yellow"
    ],
    "altCities": [
      "Thành phố Hồ Chí Minh",
      "Đà Nẵng",
      "Huế",
      "Hải Phòng"
    ],
    "facts": [
      {
        "id": "vn-geography-continent",
        "category": "geography",
        "vi": "Việt Nam nằm ở Châu Á.",
        "en": "Vietnam is in Asia.",
        "question": "Việt Nam nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "vn-capital-hanoi",
        "category": "capital",
        "vi": "Thủ đô của Việt Nam là Hà Nội.",
        "en": "The capital of Vietnam is Hanoi.",
        "question": "Thủ đô của Việt Nam là thành phố nào?",
        "answers": [
          "Hà Nội",
          "Thành phố Hồ Chí Minh",
          "Đà Nẵng",
          "Huế"
        ]
      },
      {
        "id": "vn-geography-coast",
        "category": "geography",
        "vi": "Việt Nam giáp Biển Đông.",
        "en": "Vietnam borders the Biển Đông.",
        "question": "Việt Nam giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Đông",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "vn-nature-halong",
        "category": "nature",
        "vi": "Vịnh Hạ Long có hàng nghìn đảo đá vôi trên biển.",
        "en": "Ha Long Bay has thousands of limestone islands.",
        "question": "Vịnh nổi tiếng với hàng nghìn đảo đá ở Việt Nam tên là gì?",
        "answers": [
          "Vịnh Hạ Long",
          "Vịnh Sydney",
          "Vịnh Mexico",
          "Vịnh Bengal"
        ]
      },
      {
        "id": "vn-food-pho",
        "category": "food",
        "vi": "Phở là món nước nổi tiếng của Việt Nam.",
        "en": "Pho is a famous Vietnamese noodle soup.",
        "question": "Món nước nổi tiếng của Việt Nam là gì?",
        "answers": [
          "Phở",
          "Sushi",
          "Pizza",
          "Taco"
        ]
      }
    ]
  },
  {
    "id": "ye",
    "isoCode": "YE",
    "name": "Yemen",
    "officialName": "Cộng hòa Yemen",
    "nameEn": "Yemen",
    "officialNameEn": "Republic of Yemen",
    "flag": "🇾🇪",
    "capital": "Sana'a",
    "capitalEn": "Sana'a",
    "continent": "asia",
    "region": "Tây Á",
    "subRegion": "Bán đảo Ả Rập",
    "languages": [
      "ar"
    ],
    "currency": "Rial",
    "neighbors": [
      "sa",
      "om"
    ],
    "geo": "coastal",
    "landscape": "desert",
    "flagColors": [
      "red",
      "white",
      "black"
    ],
    "altCities": [
      "Aden",
      "Taiz",
      "Al Hudaydah"
    ],
    "facts": [
      {
        "id": "ye-geography-continent",
        "category": "geography",
        "vi": "Yemen nằm ở Châu Á.",
        "en": "Yemen is in Asia.",
        "question": "Yemen nằm ở châu lục nào?",
        "answers": [
          "Châu Á",
          "Châu Âu",
          "Châu Phi",
          "Châu Đại Dương"
        ]
      },
      {
        "id": "ye-capital-sana-a",
        "category": "capital",
        "vi": "Thủ đô của Yemen là Sana'a.",
        "en": "The capital of Yemen is Sana'a.",
        "question": "Thủ đô của Yemen là thành phố nào?",
        "answers": [
          "Sana'a",
          "Aden",
          "Taiz",
          "Al Hudaydah"
        ]
      },
      {
        "id": "ye-geography-coast",
        "category": "geography",
        "vi": "Yemen giáp Biển Ả Rập.",
        "en": "Yemen borders the Biển Ả Rập.",
        "question": "Yemen giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Ả Rập",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "ye-geography-arabia",
        "category": "geography",
        "vi": "Yemen nằm ở phía nam bán đảo Ả Rập.",
        "en": "Yemen is in the south of the Arabian Peninsula.",
        "question": "Yemen nằm ở phần nào của bán đảo Ả Rập?",
        "answers": [
          "Phía nam",
          "Phía bắc cực",
          "Giữa châu Âu",
          "Trên đảo Nhật"
        ]
      }
    ]
  },
  {
    "id": "al",
    "isoCode": "AL",
    "name": "Albania",
    "officialName": "Cộng hòa Albania",
    "nameEn": "Albania",
    "officialNameEn": "Republic of Albania",
    "flag": "🇦🇱",
    "capital": "Tirana",
    "capitalEn": "Tirana",
    "continent": "europe",
    "region": "Nam Âu",
    "subRegion": "Balkan",
    "languages": [
      "sq"
    ],
    "currency": "Lek",
    "neighbors": [
      "me",
      "mk",
      "gr"
    ],
    "geo": "coastal",
    "landscape": "mountain",
    "flagColors": [
      "red",
      "black"
    ],
    "altCities": [
      "Durrës",
      "Vlorë",
      "Shkodër"
    ],
    "facts": [
      {
        "id": "al-geography-continent",
        "category": "geography",
        "vi": "Albania nằm ở Châu Âu.",
        "en": "Albania is in Europe.",
        "question": "Albania nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "al-capital-tirana",
        "category": "capital",
        "vi": "Thủ đô của Albania là Tirana.",
        "en": "The capital of Albania is Tirana.",
        "question": "Thủ đô của Albania là thành phố nào?",
        "answers": [
          "Tirana",
          "Durrës",
          "Vlorë",
          "Shkodër"
        ]
      },
      {
        "id": "al-geography-coast",
        "category": "geography",
        "vi": "Albania giáp Biển Adriatic.",
        "en": "Albania borders the Biển Adriatic.",
        "question": "Albania giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Adriatic",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "al-geography-adriatic",
        "category": "geography",
        "vi": "Albania giáp Biển Adriatic.",
        "en": "Albania meets the Adriatic Sea.",
        "question": "Albania giáp biển nào?",
        "answers": [
          "Biển Adriatic",
          "Biển Baltic",
          "Biển Đỏ",
          "Thái Bình Dương"
        ]
      }
    ]
  },
  {
    "id": "ad",
    "isoCode": "AD",
    "name": "Andorra",
    "officialName": "Công quốc Andorra",
    "nameEn": "Andorra",
    "officialNameEn": "Principality of Andorra",
    "flag": "🇦🇩",
    "capital": "Andorra la Vella",
    "capitalEn": "Andorra la Vella",
    "continent": "europe",
    "region": "Nam Âu",
    "subRegion": "Pyrenees",
    "languages": [
      "ca"
    ],
    "currency": "Euro",
    "neighbors": [
      "fr",
      "es"
    ],
    "geo": "landlocked",
    "landscape": "mountain",
    "flagColors": [
      "blue",
      "yellow",
      "red"
    ],
    "altCities": [
      "Encamp",
      "Escaldes-Engordany"
    ],
    "facts": [
      {
        "id": "ad-geography-continent",
        "category": "geography",
        "vi": "Andorra nằm ở Châu Âu.",
        "en": "Andorra is in Europe.",
        "question": "Andorra nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "ad-capital-andorra-la-vella",
        "category": "capital",
        "vi": "Thủ đô của Andorra là Andorra la Vella.",
        "en": "The capital of Andorra is Andorra la Vella.",
        "question": "Thủ đô của Andorra là thành phố nào?",
        "answers": [
          "Andorra la Vella",
          "Encamp",
          "Escaldes-Engordany",
          "Paris"
        ]
      },
      {
        "id": "ad-geography-landlocked",
        "category": "geography",
        "vi": "Andorra không giáp biển.",
        "en": "Andorra is landlocked.",
        "question": "Điều nào đúng về Andorra?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "ad-nature-pyrenees",
        "category": "nature",
        "vi": "Andorra nằm trên dãy núi Pyrenees giữa Pháp và Tây Ban Nha.",
        "en": "Andorra sits in the Pyrenees between France and Spain.",
        "question": "Andorra nằm trên dãy núi nào?",
        "answers": [
          "Pyrenees",
          "Alps",
          "Andes",
          "Himalaya"
        ]
      }
    ]
  },
  {
    "id": "at",
    "isoCode": "AT",
    "name": "Áo",
    "officialName": "Cộng hòa Áo",
    "nameEn": "Austria",
    "officialNameEn": "Republic of Austria",
    "flag": "🇦🇹",
    "capital": "Vienna",
    "capitalEn": "Vienna",
    "continent": "europe",
    "region": "Trung Âu",
    "subRegion": "Alps",
    "languages": [
      "de"
    ],
    "currency": "Euro",
    "neighbors": [
      "de",
      "cz",
      "sk",
      "hu",
      "si",
      "it",
      "ch",
      "li"
    ],
    "geo": "landlocked",
    "landscape": "mountain",
    "flagColors": [
      "red",
      "white"
    ],
    "altCities": [
      "Salzburg",
      "Innsbruck",
      "Graz",
      "Linz"
    ],
    "facts": [
      {
        "id": "at-geography-continent",
        "category": "geography",
        "vi": "Áo nằm ở Châu Âu.",
        "en": "Austria is in Europe.",
        "question": "Áo nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "at-capital-vienna",
        "category": "capital",
        "vi": "Thủ đô của Áo là Vienna.",
        "en": "The capital of Austria is Vienna.",
        "question": "Thủ đô của Áo là thành phố nào?",
        "answers": [
          "Vienna",
          "Salzburg",
          "Innsbruck",
          "Graz"
        ]
      },
      {
        "id": "at-geography-landlocked",
        "category": "geography",
        "vi": "Áo không giáp biển.",
        "en": "Austria is landlocked.",
        "question": "Điều nào đúng về Áo?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "at-nature-alps",
        "category": "nature",
        "vi": "Nước Áo có nhiều núi Alps.",
        "en": "Austria has many Alpine mountains.",
        "question": "Nước Áo nổi tiếng với dãy núi nào?",
        "answers": [
          "Alps",
          "Andes",
          "Himalaya",
          "Atlas"
        ]
      }
    ]
  },
  {
    "id": "by",
    "isoCode": "BY",
    "name": "Belarus",
    "officialName": "Cộng hòa Belarus",
    "nameEn": "Belarus",
    "officialNameEn": "Republic of Belarus",
    "flag": "🇧🇾",
    "capital": "Minsk",
    "capitalEn": "Minsk",
    "continent": "europe",
    "region": "Đông Âu",
    "subRegion": "Đông Âu",
    "languages": [
      "be",
      "ru"
    ],
    "currency": "Ruble",
    "neighbors": [
      "lt",
      "lv",
      "ru",
      "ua",
      "pl"
    ],
    "geo": "landlocked",
    "landscape": "temperate",
    "flagColors": [
      "red",
      "green"
    ],
    "altCities": [
      "Brest",
      "Gomel",
      "Vitebsk"
    ],
    "facts": [
      {
        "id": "by-geography-continent",
        "category": "geography",
        "vi": "Belarus nằm ở Châu Âu.",
        "en": "Belarus is in Europe.",
        "question": "Belarus nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "by-capital-minsk",
        "category": "capital",
        "vi": "Thủ đô của Belarus là Minsk.",
        "en": "The capital of Belarus is Minsk.",
        "question": "Thủ đô của Belarus là thành phố nào?",
        "answers": [
          "Minsk",
          "Brest",
          "Gomel",
          "Vitebsk"
        ]
      },
      {
        "id": "by-geography-landlocked",
        "category": "geography",
        "vi": "Belarus không giáp biển.",
        "en": "Belarus is landlocked.",
        "question": "Điều nào đúng về Belarus?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "by-nature-forests",
        "category": "nature",
        "vi": "Belarus có nhiều rừng và hồ ở đồng bằng Đông Âu.",
        "en": "Belarus has many forests and lakes on the East European plain.",
        "question": "Belarus nổi tiếng với dạng thiên nhiên nào?",
        "answers": [
          "Rừng và hồ",
          "Sa mạc cát",
          "Đảo san hô",
          "Sông băng nhiệt đới"
        ]
      }
    ]
  },
  {
    "id": "be",
    "isoCode": "BE",
    "name": "Bỉ",
    "officialName": "Vương quốc Bỉ",
    "nameEn": "Belgium",
    "officialNameEn": "Kingdom of Belgium",
    "flag": "🇧🇪",
    "capital": "Brussels",
    "capitalEn": "Brussels",
    "continent": "europe",
    "region": "Tây Âu",
    "subRegion": "Low Countries",
    "languages": [
      "nl",
      "fr",
      "de"
    ],
    "currency": "Euro",
    "neighbors": [
      "nl",
      "de",
      "lu",
      "fr"
    ],
    "geo": "coastal",
    "landscape": "temperate",
    "flagColors": [
      "black",
      "yellow",
      "red"
    ],
    "altCities": [
      "Antwerp",
      "Ghent",
      "Bruges",
      "Liège"
    ],
    "facts": [
      {
        "id": "be-geography-continent",
        "category": "geography",
        "vi": "Bỉ nằm ở Châu Âu.",
        "en": "Belgium is in Europe.",
        "question": "Bỉ nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "be-capital-brussels",
        "category": "capital",
        "vi": "Thủ đô của Bỉ là Brussels.",
        "en": "The capital of Belgium is Brussels.",
        "question": "Thủ đô của Bỉ là thành phố nào?",
        "answers": [
          "Brussels",
          "Antwerp",
          "Ghent",
          "Bruges"
        ]
      },
      {
        "id": "be-geography-coast",
        "category": "geography",
        "vi": "Bỉ giáp Biển Bắc.",
        "en": "Belgium borders the Biển Bắc.",
        "question": "Bỉ giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Bắc",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "be-food-chocolate",
        "category": "food",
        "vi": "Bỉ nổi tiếng với sô-cô-la và bánh waffle.",
        "en": "Belgium is famous for chocolate and waffles.",
        "question": "Bỉ nổi tiếng với món ngọt nào?",
        "answers": [
          "Sô-cô-la và waffle",
          "Sushi",
          "Phở",
          "Taco"
        ]
      }
    ]
  },
  {
    "id": "ba",
    "isoCode": "BA",
    "name": "Bosnia và Herzegovina",
    "officialName": "Bosnia và Herzegovina",
    "nameEn": "Bosnia and Herzegovina",
    "officialNameEn": "Bosnia and Herzegovina",
    "flag": "🇧🇦",
    "capital": "Sarajevo",
    "capitalEn": "Sarajevo",
    "continent": "europe",
    "region": "Nam Âu",
    "subRegion": "Balkan",
    "languages": [
      "bs",
      "hr",
      "sr"
    ],
    "currency": "Mark",
    "neighbors": [
      "hr",
      "rs",
      "me"
    ],
    "geo": "coastal",
    "landscape": "mountain",
    "flagColors": [
      "blue",
      "yellow",
      "white"
    ],
    "altCities": [
      "Mostar",
      "Banja Luka",
      "Tuzla"
    ],
    "facts": [
      {
        "id": "ba-geography-continent",
        "category": "geography",
        "vi": "Bosnia và Herzegovina nằm ở Châu Âu.",
        "en": "Bosnia and Herzegovina is in Europe.",
        "question": "Bosnia và Herzegovina nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "ba-capital-sarajevo",
        "category": "capital",
        "vi": "Thủ đô của Bosnia và Herzegovina là Sarajevo.",
        "en": "The capital of Bosnia and Herzegovina is Sarajevo.",
        "question": "Thủ đô của Bosnia và Herzegovina là thành phố nào?",
        "answers": [
          "Sarajevo",
          "Mostar",
          "Banja Luka",
          "Tuzla"
        ]
      },
      {
        "id": "ba-geography-coast",
        "category": "geography",
        "vi": "Bosnia và Herzegovina giáp Biển Adriatic.",
        "en": "Bosnia and Herzegovina borders the Biển Adriatic.",
        "question": "Bosnia và Herzegovina giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Adriatic",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "ba-nature-dinaric",
        "category": "nature",
        "vi": "Bosnia và Herzegovina có nhiều núi Dinaric.",
        "en": "Bosnia and Herzegovina has many Dinaric mountains.",
        "question": "Bosnia và Herzegovina nổi tiếng với dạng địa hình nào?",
        "answers": [
          "Núi",
          "Sa mạc Sahara",
          "Đảo san hô",
          "Sông băng Bắc Cực"
        ]
      }
    ]
  },
  {
    "id": "bg",
    "isoCode": "BG",
    "name": "Bulgaria",
    "officialName": "Cộng hòa Bulgaria",
    "nameEn": "Bulgaria",
    "officialNameEn": "Republic of Bulgaria",
    "flag": "🇧🇬",
    "capital": "Sofia",
    "capitalEn": "Sofia",
    "continent": "europe",
    "region": "Đông Âu",
    "subRegion": "Balkan",
    "languages": [
      "bg"
    ],
    "currency": "Lev",
    "neighbors": [
      "ro",
      "rs",
      "mk",
      "gr",
      "tr"
    ],
    "geo": "coastal",
    "landscape": "temperate",
    "flagColors": [
      "white",
      "green",
      "red"
    ],
    "altCities": [
      "Plovdiv",
      "Varna",
      "Burgas"
    ],
    "facts": [
      {
        "id": "bg-geography-continent",
        "category": "geography",
        "vi": "Bulgaria nằm ở Châu Âu.",
        "en": "Bulgaria is in Europe.",
        "question": "Bulgaria nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "bg-capital-sofia",
        "category": "capital",
        "vi": "Thủ đô của Bulgaria là Sofia.",
        "en": "The capital of Bulgaria is Sofia.",
        "question": "Thủ đô của Bulgaria là thành phố nào?",
        "answers": [
          "Sofia",
          "Plovdiv",
          "Varna",
          "Burgas"
        ]
      },
      {
        "id": "bg-geography-coast",
        "category": "geography",
        "vi": "Bulgaria giáp Biển Đen.",
        "en": "Bulgaria borders the Biển Đen.",
        "question": "Bulgaria giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Đen",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "bg-geography-blacksea",
        "category": "geography",
        "vi": "Bulgaria giáp Biển Đen.",
        "en": "Bulgaria meets the Black Sea.",
        "question": "Bulgaria giáp biển nào?",
        "answers": [
          "Biển Đen",
          "Biển Đỏ",
          "Biển Baltic",
          "Thái Bình Dương"
        ]
      }
    ]
  },
  {
    "id": "hr",
    "isoCode": "HR",
    "name": "Croatia",
    "officialName": "Cộng hòa Croatia",
    "nameEn": "Croatia",
    "officialNameEn": "Republic of Croatia",
    "flag": "🇭🇷",
    "capital": "Zagreb",
    "capitalEn": "Zagreb",
    "continent": "europe",
    "region": "Nam Âu",
    "subRegion": "Balkan",
    "languages": [
      "hr"
    ],
    "currency": "Euro",
    "neighbors": [
      "si",
      "hu",
      "rs",
      "ba",
      "me"
    ],
    "geo": "coastal",
    "landscape": "temperate",
    "flagColors": [
      "red",
      "white",
      "blue"
    ],
    "altCities": [
      "Split",
      "Dubrovnik",
      "Rijeka"
    ],
    "facts": [
      {
        "id": "hr-geography-continent",
        "category": "geography",
        "vi": "Croatia nằm ở Châu Âu.",
        "en": "Croatia is in Europe.",
        "question": "Croatia nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "hr-capital-zagreb",
        "category": "capital",
        "vi": "Thủ đô của Croatia là Zagreb.",
        "en": "The capital of Croatia is Zagreb.",
        "question": "Thủ đô của Croatia là thành phố nào?",
        "answers": [
          "Zagreb",
          "Split",
          "Dubrovnik",
          "Rijeka"
        ]
      },
      {
        "id": "hr-geography-coast",
        "category": "geography",
        "vi": "Croatia giáp Biển Adriatic.",
        "en": "Croatia borders the Biển Adriatic.",
        "question": "Croatia giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Adriatic",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "hr-geography-adriatic",
        "category": "geography",
        "vi": "Croatia có bờ biển Adriatic với nhiều đảo nhỏ.",
        "en": "Croatia has an Adriatic coast with many small islands.",
        "question": "Croatia giáp biển nào?",
        "answers": [
          "Biển Adriatic",
          "Biển Baltic",
          "Biển Đỏ",
          "Thái Bình Dương"
        ]
      }
    ]
  },
  {
    "id": "cz",
    "isoCode": "CZ",
    "name": "Séc",
    "officialName": "Cộng hòa Séc",
    "nameEn": "Czechia",
    "officialNameEn": "Czech Republic",
    "flag": "🇨🇿",
    "capital": "Praha",
    "capitalEn": "Prague",
    "continent": "europe",
    "region": "Trung Âu",
    "subRegion": "Trung Âu",
    "languages": [
      "cs"
    ],
    "currency": "Koruna",
    "neighbors": [
      "de",
      "pl",
      "sk",
      "at"
    ],
    "geo": "landlocked",
    "landscape": "temperate",
    "flagColors": [
      "white",
      "red",
      "blue"
    ],
    "altCities": [
      "Brno",
      "Ostrava",
      "Plzeň"
    ],
    "facts": [
      {
        "id": "cz-geography-continent",
        "category": "geography",
        "vi": "Séc nằm ở Châu Âu.",
        "en": "Czechia is in Europe.",
        "question": "Séc nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "cz-capital-prague",
        "category": "capital",
        "vi": "Thủ đô của Séc là Praha.",
        "en": "The capital of Czechia is Prague.",
        "question": "Thủ đô của Séc là thành phố nào?",
        "answers": [
          "Praha",
          "Brno",
          "Ostrava",
          "Plzeň"
        ]
      },
      {
        "id": "cz-geography-landlocked",
        "category": "geography",
        "vi": "Séc không giáp biển.",
        "en": "Czechia is landlocked.",
        "question": "Điều nào đúng về Séc?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "cz-landmarks-prague",
        "category": "landmarks",
        "vi": "Lâu đài Praha là khu lâu đài lớn ở thủ đô Séc.",
        "en": "Prague Castle is a large castle area in Czechia's capital.",
        "question": "Khu lâu đài lớn ở thủ đô Séc tên là gì?",
        "answers": [
          "Lâu đài Praha",
          "Lâu đài Windsor",
          "Kim tự tháp",
          "Tháp Eiffel"
        ]
      }
    ]
  },
  {
    "id": "dk",
    "isoCode": "DK",
    "name": "Đan Mạch",
    "officialName": "Vương quốc Đan Mạch",
    "nameEn": "Denmark",
    "officialNameEn": "Kingdom of Denmark",
    "flag": "🇩🇰",
    "capital": "Copenhagen",
    "capitalEn": "Copenhagen",
    "continent": "europe",
    "region": "Bắc Âu",
    "subRegion": "Bán đảo Jutland",
    "languages": [
      "da"
    ],
    "currency": "Krone",
    "neighbors": [
      "de"
    ],
    "geo": "coastal",
    "landscape": "temperate",
    "flagColors": [
      "red",
      "white"
    ],
    "altCities": [
      "Aarhus",
      "Odense",
      "Aalborg"
    ],
    "facts": [
      {
        "id": "dk-geography-continent",
        "category": "geography",
        "vi": "Đan Mạch nằm ở Châu Âu.",
        "en": "Denmark is in Europe.",
        "question": "Đan Mạch nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "dk-capital-copenhagen",
        "category": "capital",
        "vi": "Thủ đô của Đan Mạch là Copenhagen.",
        "en": "The capital of Denmark is Copenhagen.",
        "question": "Thủ đô của Đan Mạch là thành phố nào?",
        "answers": [
          "Copenhagen",
          "Aarhus",
          "Odense",
          "Aalborg"
        ]
      },
      {
        "id": "dk-geography-coast",
        "category": "geography",
        "vi": "Đan Mạch giáp Biển Bắc.",
        "en": "Denmark borders the Biển Bắc.",
        "question": "Đan Mạch giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Bắc",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "dk-landmarks-mermaid",
        "category": "landmarks",
        "vi": "Tượng Nàng tiên cá ngồi trên đá ở Copenhagen.",
        "en": "The Little Mermaid statue sits on a rock in Copenhagen.",
        "question": "Bức tượng nổi tiếng trên đá ở Copenhagen là gì?",
        "answers": [
          "Nàng tiên cá",
          "Tượng Nữ thần Tự do",
          "Nhà thờ Đức Bà",
          "Tháp Pisa"
        ]
      }
    ]
  },
  {
    "id": "ee",
    "isoCode": "EE",
    "name": "Estonia",
    "officialName": "Cộng hòa Estonia",
    "nameEn": "Estonia",
    "officialNameEn": "Republic of Estonia",
    "flag": "🇪🇪",
    "capital": "Tallinn",
    "capitalEn": "Tallinn",
    "continent": "europe",
    "region": "Bắc Âu",
    "subRegion": "Baltic",
    "languages": [
      "et"
    ],
    "currency": "Euro",
    "neighbors": [
      "lv",
      "ru"
    ],
    "geo": "coastal",
    "landscape": "temperate",
    "flagColors": [
      "blue",
      "black",
      "white"
    ],
    "altCities": [
      "Tartu",
      "Narva"
    ],
    "facts": [
      {
        "id": "ee-geography-continent",
        "category": "geography",
        "vi": "Estonia nằm ở Châu Âu.",
        "en": "Estonia is in Europe.",
        "question": "Estonia nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "ee-capital-tallinn",
        "category": "capital",
        "vi": "Thủ đô của Estonia là Tallinn.",
        "en": "The capital of Estonia is Tallinn.",
        "question": "Thủ đô của Estonia là thành phố nào?",
        "answers": [
          "Tallinn",
          "Tartu",
          "Narva",
          "Paris"
        ]
      },
      {
        "id": "ee-geography-coast",
        "category": "geography",
        "vi": "Estonia giáp Biển Baltic.",
        "en": "Estonia borders the Biển Baltic.",
        "question": "Estonia giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Baltic",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "ee-geography-baltic",
        "category": "geography",
        "vi": "Estonia giáp Biển Baltic.",
        "en": "Estonia meets the Baltic Sea.",
        "question": "Estonia giáp biển nào?",
        "answers": [
          "Biển Baltic",
          "Địa Trung Hải",
          "Biển Đỏ",
          "Thái Bình Dương"
        ]
      }
    ]
  },
  {
    "id": "fi",
    "isoCode": "FI",
    "name": "Phần Lan",
    "officialName": "Cộng hòa Phần Lan",
    "nameEn": "Finland",
    "officialNameEn": "Republic of Finland",
    "flag": "🇫🇮",
    "capital": "Helsinki",
    "capitalEn": "Helsinki",
    "continent": "europe",
    "region": "Bắc Âu",
    "subRegion": "Fennoscandia",
    "languages": [
      "fi",
      "sv"
    ],
    "currency": "Euro",
    "neighbors": [
      "se",
      "no",
      "ru"
    ],
    "geo": "coastal",
    "landscape": "temperate",
    "flagColors": [
      "white",
      "blue"
    ],
    "altCities": [
      "Tampere",
      "Turku",
      "Oulu"
    ],
    "facts": [
      {
        "id": "fi-geography-continent",
        "category": "geography",
        "vi": "Phần Lan nằm ở Châu Âu.",
        "en": "Finland is in Europe.",
        "question": "Phần Lan nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "fi-capital-helsinki",
        "category": "capital",
        "vi": "Thủ đô của Phần Lan là Helsinki.",
        "en": "The capital of Finland is Helsinki.",
        "question": "Thủ đô của Phần Lan là thành phố nào?",
        "answers": [
          "Helsinki",
          "Tampere",
          "Turku",
          "Oulu"
        ]
      },
      {
        "id": "fi-geography-coast",
        "category": "geography",
        "vi": "Phần Lan giáp Biển Baltic.",
        "en": "Finland borders the Biển Baltic.",
        "question": "Phần Lan giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Baltic",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "fi-nature-lakes",
        "category": "nature",
        "vi": "Phần Lan có hàng nghìn hồ nước ngọt.",
        "en": "Finland has thousands of freshwater lakes.",
        "question": "Phần Lan nổi tiếng vì có rất nhiều thứ gì?",
        "answers": [
          "Hồ nước",
          "Sa mạc",
          "Núi lửa",
          "Rặng san hô"
        ]
      }
    ]
  },
  {
    "id": "fr",
    "isoCode": "FR",
    "name": "Pháp",
    "officialName": "Cộng hòa Pháp",
    "nameEn": "France",
    "officialNameEn": "French Republic",
    "flag": "🇫🇷",
    "capital": "Paris",
    "capitalEn": "Paris",
    "continent": "europe",
    "region": "Tây Âu",
    "subRegion": "Tây Âu",
    "languages": [
      "fr"
    ],
    "currency": "Euro",
    "neighbors": [
      "be",
      "lu",
      "de",
      "ch",
      "it",
      "es",
      "ad",
      "mc"
    ],
    "geo": "coastal",
    "landscape": "temperate",
    "flagColors": [
      "blue",
      "white",
      "red"
    ],
    "altCities": [
      "Lyon",
      "Marseille",
      "Nice",
      "Toulouse"
    ],
    "facts": [
      {
        "id": "fr-geography-continent",
        "category": "geography",
        "vi": "Pháp nằm ở Châu Âu.",
        "en": "France is in Europe.",
        "question": "Pháp nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "fr-capital-paris",
        "category": "capital",
        "vi": "Thủ đô của Pháp là Paris.",
        "en": "The capital of France is Paris.",
        "question": "Thủ đô của Pháp là thành phố nào?",
        "answers": [
          "Paris",
          "Lyon",
          "Marseille",
          "Nice"
        ]
      },
      {
        "id": "fr-geography-coast",
        "category": "geography",
        "vi": "Pháp giáp Địa Trung Hải.",
        "en": "France borders the Địa Trung Hải.",
        "question": "Pháp giáp biển hoặc đại dương nào?",
        "answers": [
          "Địa Trung Hải",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "fr-landmarks-eiffel",
        "category": "landmarks",
        "vi": "Tháp Eiffel đứng ở Paris, thủ đô nước Pháp.",
        "en": "The Eiffel Tower stands in Paris, the capital of France.",
        "question": "Ngọn tháp nổi tiếng ở Paris tên là gì?",
        "answers": [
          "Tháp Eiffel",
          "Tháp Pisa",
          "Big Ben",
          "Tượng Nữ thần Tự do"
        ]
      },
      {
        "id": "fr-food-croissant",
        "category": "food",
        "vi": "Bánh sừng bò croissant là món bánh nổi tiếng của Pháp.",
        "en": "The croissant is a famous French pastry.",
        "question": "Món bánh sừng bò nổi tiếng của Pháp tên là gì?",
        "answers": [
          "Croissant",
          "Sushi",
          "Taco",
          "Kimchi"
        ]
      }
    ]
  },
  {
    "id": "de",
    "isoCode": "DE",
    "name": "Đức",
    "officialName": "Cộng hòa Liên bang Đức",
    "nameEn": "Germany",
    "officialNameEn": "Federal Republic of Germany",
    "flag": "🇩🇪",
    "capital": "Berlin",
    "capitalEn": "Berlin",
    "continent": "europe",
    "region": "Tây Âu",
    "subRegion": "Trung Âu",
    "languages": [
      "de"
    ],
    "currency": "Euro",
    "neighbors": [
      "dk",
      "pl",
      "cz",
      "at",
      "ch",
      "fr",
      "lu",
      "be",
      "nl"
    ],
    "geo": "coastal",
    "landscape": "temperate",
    "flagColors": [
      "black",
      "red",
      "yellow"
    ],
    "altCities": [
      "Munich",
      "Hamburg",
      "Frankfurt",
      "Cologne"
    ],
    "facts": [
      {
        "id": "de-geography-continent",
        "category": "geography",
        "vi": "Đức nằm ở Châu Âu.",
        "en": "Germany is in Europe.",
        "question": "Đức nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "de-capital-berlin",
        "category": "capital",
        "vi": "Thủ đô của Đức là Berlin.",
        "en": "The capital of Germany is Berlin.",
        "question": "Thủ đô của Đức là thành phố nào?",
        "answers": [
          "Berlin",
          "Munich",
          "Hamburg",
          "Frankfurt"
        ]
      },
      {
        "id": "de-geography-coast",
        "category": "geography",
        "vi": "Đức giáp Biển Bắc.",
        "en": "Germany borders the Biển Bắc.",
        "question": "Đức giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Bắc",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "de-landmarks-brandenburg",
        "category": "landmarks",
        "vi": "Cổng Brandenburg là công trình nổi tiếng ở Berlin.",
        "en": "The Brandenburg Gate is a famous landmark in Berlin.",
        "question": "Cổng nổi tiếng ở Berlin tên là gì?",
        "answers": [
          "Cổng Brandenburg",
          "Tháp Eiffel",
          "Colosseum",
          "Big Ben"
        ]
      }
    ]
  },
  {
    "id": "gr",
    "isoCode": "GR",
    "name": "Hy Lạp",
    "officialName": "Cộng hòa Hy Lạp",
    "nameEn": "Greece",
    "officialNameEn": "Hellenic Republic",
    "flag": "🇬🇷",
    "capital": "Athens",
    "capitalEn": "Athens",
    "continent": "europe",
    "region": "Nam Âu",
    "subRegion": "Balkan",
    "languages": [
      "el"
    ],
    "currency": "Euro",
    "neighbors": [
      "al",
      "mk",
      "bg",
      "tr"
    ],
    "geo": "coastal",
    "landscape": "temperate",
    "flagColors": [
      "blue",
      "white"
    ],
    "altCities": [
      "Thessaloniki",
      "Patras",
      "Heraklion",
      "Rhodes"
    ],
    "facts": [
      {
        "id": "gr-geography-continent",
        "category": "geography",
        "vi": "Hy Lạp nằm ở Châu Âu.",
        "en": "Greece is in Europe.",
        "question": "Hy Lạp nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "gr-capital-athens",
        "category": "capital",
        "vi": "Thủ đô của Hy Lạp là Athens.",
        "en": "The capital of Greece is Athens.",
        "question": "Thủ đô của Hy Lạp là thành phố nào?",
        "answers": [
          "Athens",
          "Thessaloniki",
          "Patras",
          "Heraklion"
        ]
      },
      {
        "id": "gr-geography-coast",
        "category": "geography",
        "vi": "Hy Lạp giáp Địa Trung Hải.",
        "en": "Greece borders the Địa Trung Hải.",
        "question": "Hy Lạp giáp biển hoặc đại dương nào?",
        "answers": [
          "Địa Trung Hải",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "gr-landmarks-parthenon",
        "category": "landmarks",
        "vi": "Đền Parthenon cổ đứng trên đồi Acropolis ở Athens.",
        "en": "The ancient Parthenon stands on the Acropolis in Athens.",
        "question": "Ngôi đền cổ nổi tiếng ở Athens tên là gì?",
        "answers": [
          "Parthenon",
          "Colosseum",
          "Taj Mahal",
          "Angkor Wat"
        ]
      }
    ]
  },
  {
    "id": "hu",
    "isoCode": "HU",
    "name": "Hungary",
    "officialName": "Hungary",
    "nameEn": "Hungary",
    "officialNameEn": "Hungary",
    "flag": "🇭🇺",
    "capital": "Budapest",
    "capitalEn": "Budapest",
    "continent": "europe",
    "region": "Trung Âu",
    "subRegion": "Lưu vực Carpath",
    "languages": [
      "hu"
    ],
    "currency": "Forint",
    "neighbors": [
      "at",
      "sk",
      "ua",
      "ro",
      "rs",
      "hr",
      "si"
    ],
    "geo": "landlocked",
    "landscape": "temperate",
    "flagColors": [
      "red",
      "white",
      "green"
    ],
    "altCities": [
      "Debrecen",
      "Szeged",
      "Pécs"
    ],
    "facts": [
      {
        "id": "hu-geography-continent",
        "category": "geography",
        "vi": "Hungary nằm ở Châu Âu.",
        "en": "Hungary is in Europe.",
        "question": "Hungary nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "hu-capital-budapest",
        "category": "capital",
        "vi": "Thủ đô của Hungary là Budapest.",
        "en": "The capital of Hungary is Budapest.",
        "question": "Thủ đô của Hungary là thành phố nào?",
        "answers": [
          "Budapest",
          "Debrecen",
          "Szeged",
          "Pécs"
        ]
      },
      {
        "id": "hu-geography-landlocked",
        "category": "geography",
        "vi": "Hungary không giáp biển.",
        "en": "Hungary is landlocked.",
        "question": "Điều nào đúng về Hungary?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "hu-geography-danube",
        "category": "geography",
        "vi": "Sông Danube chảy qua thủ đô Budapest của Hungary.",
        "en": "The Danube River flows through Budapest, Hungary.",
        "question": "Con sông chảy qua Budapest tên là gì?",
        "answers": [
          "Sông Danube",
          "Sông Nile",
          "Sông Amazon",
          "Sông Mekong"
        ]
      }
    ]
  },
  {
    "id": "is",
    "isoCode": "IS",
    "name": "Iceland",
    "officialName": "Iceland",
    "nameEn": "Iceland",
    "officialNameEn": "Iceland",
    "flag": "🇮🇸",
    "capital": "Reykjavík",
    "capitalEn": "Reykjavík",
    "continent": "europe",
    "region": "Bắc Âu",
    "subRegion": "Bắc Đại Tây Dương",
    "languages": [
      "is"
    ],
    "currency": "Króna",
    "neighbors": [],
    "geo": "island",
    "landscape": "arctic",
    "flagColors": [
      "blue",
      "red",
      "white"
    ],
    "altCities": [
      "Akureyri",
      "Keflavík"
    ],
    "facts": [
      {
        "id": "is-geography-continent",
        "category": "geography",
        "vi": "Iceland nằm ở Châu Âu.",
        "en": "Iceland is in Europe.",
        "question": "Iceland nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "is-capital-reykjavík",
        "category": "capital",
        "vi": "Thủ đô của Iceland là Reykjavík.",
        "en": "The capital of Iceland is Reykjavík.",
        "question": "Thủ đô của Iceland là thành phố nào?",
        "answers": [
          "Reykjavík",
          "Akureyri",
          "Keflavík",
          "Paris"
        ]
      },
      {
        "id": "is-geography-island",
        "category": "geography",
        "vi": "Iceland là một quốc gia đảo.",
        "en": "Iceland is an island country.",
        "question": "Điều nào đúng về Iceland?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "is-nature-geyser",
        "category": "nature",
        "vi": "Iceland có suối nước nóng phun và cực quang.",
        "en": "Iceland has geysers and the northern lights.",
        "question": "Iceland nổi tiếng với hiện tượng ánh sáng nào trên trời?",
        "answers": [
          "Cực quang",
          "Mống lửa",
          "Cầu vồng đôi mỗi giờ",
          "Nhật thực mỗi ngày"
        ]
      }
    ]
  },
  {
    "id": "ie",
    "isoCode": "IE",
    "name": "Ireland",
    "officialName": "Ireland",
    "nameEn": "Ireland",
    "officialNameEn": "Ireland",
    "flag": "🇮🇪",
    "capital": "Dublin",
    "capitalEn": "Dublin",
    "continent": "europe",
    "region": "Bắc Âu",
    "subRegion": "Đảo Ireland",
    "languages": [
      "en",
      "ga"
    ],
    "currency": "Euro",
    "neighbors": [
      "gb"
    ],
    "geo": "island",
    "landscape": "temperate",
    "flagColors": [
      "green",
      "white",
      "orange"
    ],
    "altCities": [
      "Cork",
      "Galway",
      "Limerick"
    ],
    "facts": [
      {
        "id": "ie-geography-continent",
        "category": "geography",
        "vi": "Ireland nằm ở Châu Âu.",
        "en": "Ireland is in Europe.",
        "question": "Ireland nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "ie-capital-dublin",
        "category": "capital",
        "vi": "Thủ đô của Ireland là Dublin.",
        "en": "The capital of Ireland is Dublin.",
        "question": "Thủ đô của Ireland là thành phố nào?",
        "answers": [
          "Dublin",
          "Cork",
          "Galway",
          "Limerick"
        ]
      },
      {
        "id": "ie-geography-island",
        "category": "geography",
        "vi": "Ireland là một quốc gia đảo.",
        "en": "Ireland is an island country.",
        "question": "Điều nào đúng về Ireland?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "ie-geography-green",
        "category": "geography",
        "vi": "Ireland được gọi là Đảo Ngọc lục bảo vì cây cỏ rất xanh.",
        "en": "Ireland is called the Emerald Isle because it is so green.",
        "question": "Ireland còn được gọi là đảo gì?",
        "answers": [
          "Đảo Ngọc lục bảo",
          "Đảo San hô",
          "Đảo Băng",
          "Đảo Lửa"
        ]
      }
    ]
  },
  {
    "id": "it",
    "isoCode": "IT",
    "name": "Ý",
    "officialName": "Cộng hòa Ý",
    "nameEn": "Italy",
    "officialNameEn": "Italian Republic",
    "flag": "🇮🇹",
    "capital": "Roma",
    "capitalEn": "Rome",
    "continent": "europe",
    "region": "Nam Âu",
    "subRegion": "Bán đảo Ý",
    "languages": [
      "it"
    ],
    "currency": "Euro",
    "neighbors": [
      "fr",
      "ch",
      "at",
      "si",
      "sm",
      "va"
    ],
    "geo": "coastal",
    "landscape": "temperate",
    "flagColors": [
      "green",
      "white",
      "red"
    ],
    "altCities": [
      "Milan",
      "Naples",
      "Florence",
      "Venice"
    ],
    "facts": [
      {
        "id": "it-geography-continent",
        "category": "geography",
        "vi": "Ý nằm ở Châu Âu.",
        "en": "Italy is in Europe.",
        "question": "Ý nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "it-capital-rome",
        "category": "capital",
        "vi": "Thủ đô của Ý là Roma.",
        "en": "The capital of Italy is Rome.",
        "question": "Thủ đô của Ý là thành phố nào?",
        "answers": [
          "Roma",
          "Milan",
          "Naples",
          "Florence"
        ]
      },
      {
        "id": "it-geography-coast",
        "category": "geography",
        "vi": "Ý giáp Địa Trung Hải.",
        "en": "Italy borders the Địa Trung Hải.",
        "question": "Ý giáp biển hoặc đại dương nào?",
        "answers": [
          "Địa Trung Hải",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "it-landmarks-colosseum",
        "category": "landmarks",
        "vi": "Đấu trường Colosseum là công trình đá cổ ở Roma.",
        "en": "The Colosseum is an ancient stone arena in Rome.",
        "question": "Đấu trường đá cổ ở Roma tên là gì?",
        "answers": [
          "Colosseum",
          "Tháp Eiffel",
          "Kim tự tháp",
          "Taj Mahal"
        ]
      },
      {
        "id": "it-food-pizza",
        "category": "food",
        "vi": "Pizza ra đời ở Ý.",
        "en": "Pizza comes from Italy.",
        "question": "Món bánh tròn với phô mai nổi tiếng của Ý là gì?",
        "answers": [
          "Pizza",
          "Phở",
          "Sushi",
          "Paella"
        ]
      }
    ]
  },
  {
    "id": "lv",
    "isoCode": "LV",
    "name": "Latvia",
    "officialName": "Cộng hòa Latvia",
    "nameEn": "Latvia",
    "officialNameEn": "Republic of Latvia",
    "flag": "🇱🇻",
    "capital": "Riga",
    "capitalEn": "Riga",
    "continent": "europe",
    "region": "Bắc Âu",
    "subRegion": "Baltic",
    "languages": [
      "lv"
    ],
    "currency": "Euro",
    "neighbors": [
      "ee",
      "ru",
      "by",
      "lt"
    ],
    "geo": "coastal",
    "landscape": "temperate",
    "flagColors": [
      "red",
      "white"
    ],
    "altCities": [
      "Daugavpils",
      "Liepāja"
    ],
    "facts": [
      {
        "id": "lv-geography-continent",
        "category": "geography",
        "vi": "Latvia nằm ở Châu Âu.",
        "en": "Latvia is in Europe.",
        "question": "Latvia nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "lv-capital-riga",
        "category": "capital",
        "vi": "Thủ đô của Latvia là Riga.",
        "en": "The capital of Latvia is Riga.",
        "question": "Thủ đô của Latvia là thành phố nào?",
        "answers": [
          "Riga",
          "Daugavpils",
          "Liepāja",
          "Paris"
        ]
      },
      {
        "id": "lv-geography-coast",
        "category": "geography",
        "vi": "Latvia giáp Biển Baltic.",
        "en": "Latvia borders the Biển Baltic.",
        "question": "Latvia giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Baltic",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "lv-geography-baltic",
        "category": "geography",
        "vi": "Latvia giáp Biển Baltic.",
        "en": "Latvia meets the Baltic Sea.",
        "question": "Latvia giáp biển nào?",
        "answers": [
          "Biển Baltic",
          "Địa Trung Hải",
          "Biển Đỏ",
          "Thái Bình Dương"
        ]
      }
    ]
  },
  {
    "id": "li",
    "isoCode": "LI",
    "name": "Liechtenstein",
    "officialName": "Công quốc Liechtenstein",
    "nameEn": "Liechtenstein",
    "officialNameEn": "Principality of Liechtenstein",
    "flag": "🇱🇮",
    "capital": "Vaduz",
    "capitalEn": "Vaduz",
    "continent": "europe",
    "region": "Tây Âu",
    "subRegion": "Alps",
    "languages": [
      "de"
    ],
    "currency": "Franc Thụy Sĩ",
    "neighbors": [
      "ch",
      "at"
    ],
    "geo": "landlocked",
    "landscape": "mountain",
    "flagColors": [
      "blue",
      "red"
    ],
    "altCities": [
      "Schaan",
      "Balzers"
    ],
    "facts": [
      {
        "id": "li-geography-continent",
        "category": "geography",
        "vi": "Liechtenstein nằm ở Châu Âu.",
        "en": "Liechtenstein is in Europe.",
        "question": "Liechtenstein nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "li-capital-vaduz",
        "category": "capital",
        "vi": "Thủ đô của Liechtenstein là Vaduz.",
        "en": "The capital of Liechtenstein is Vaduz.",
        "question": "Thủ đô của Liechtenstein là thành phố nào?",
        "answers": [
          "Vaduz",
          "Schaan",
          "Balzers",
          "Paris"
        ]
      },
      {
        "id": "li-geography-landlocked",
        "category": "geography",
        "vi": "Liechtenstein không giáp biển.",
        "en": "Liechtenstein is landlocked.",
        "question": "Điều nào đúng về Liechtenstein?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "li-geography-alps",
        "category": "geography",
        "vi": "Liechtenstein là quốc gia rất nhỏ nằm trên núi Alps.",
        "en": "Liechtenstein is a very small country in the Alps.",
        "question": "Liechtenstein nằm trên dãy núi nào?",
        "answers": [
          "Alps",
          "Andes",
          "Himalaya",
          "Atlas"
        ]
      }
    ]
  },
  {
    "id": "lt",
    "isoCode": "LT",
    "name": "Litva",
    "officialName": "Cộng hòa Litva",
    "nameEn": "Lithuania",
    "officialNameEn": "Republic of Lithuania",
    "flag": "🇱🇹",
    "capital": "Vilnius",
    "capitalEn": "Vilnius",
    "continent": "europe",
    "region": "Bắc Âu",
    "subRegion": "Baltic",
    "languages": [
      "lt"
    ],
    "currency": "Euro",
    "neighbors": [
      "lv",
      "by",
      "pl",
      "ru"
    ],
    "geo": "coastal",
    "landscape": "temperate",
    "flagColors": [
      "yellow",
      "green",
      "red"
    ],
    "altCities": [
      "Kaunas",
      "Klaipėda"
    ],
    "facts": [
      {
        "id": "lt-geography-continent",
        "category": "geography",
        "vi": "Litva nằm ở Châu Âu.",
        "en": "Lithuania is in Europe.",
        "question": "Litva nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "lt-capital-vilnius",
        "category": "capital",
        "vi": "Thủ đô của Litva là Vilnius.",
        "en": "The capital of Lithuania is Vilnius.",
        "question": "Thủ đô của Litva là thành phố nào?",
        "answers": [
          "Vilnius",
          "Kaunas",
          "Klaipėda",
          "Paris"
        ]
      },
      {
        "id": "lt-geography-coast",
        "category": "geography",
        "vi": "Litva giáp Biển Baltic.",
        "en": "Lithuania borders the Biển Baltic.",
        "question": "Litva giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Baltic",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "lt-geography-baltic",
        "category": "geography",
        "vi": "Litva giáp Biển Baltic.",
        "en": "Lithuania meets the Baltic Sea.",
        "question": "Litva giáp biển nào?",
        "answers": [
          "Biển Baltic",
          "Địa Trung Hải",
          "Biển Đỏ",
          "Thái Bình Dương"
        ]
      }
    ]
  },
  {
    "id": "lu",
    "isoCode": "LU",
    "name": "Luxembourg",
    "officialName": "Đại công quốc Luxembourg",
    "nameEn": "Luxembourg",
    "officialNameEn": "Grand Duchy of Luxembourg",
    "flag": "🇱🇺",
    "capital": "Luxembourg",
    "capitalEn": "Luxembourg",
    "continent": "europe",
    "region": "Tây Âu",
    "subRegion": "Low Countries",
    "languages": [
      "fr",
      "de"
    ],
    "currency": "Euro",
    "neighbors": [
      "be",
      "de",
      "fr"
    ],
    "geo": "landlocked",
    "landscape": "temperate",
    "flagColors": [
      "red",
      "white",
      "blue"
    ],
    "altCities": [
      "Esch-sur-Alzette",
      "Differdange"
    ],
    "facts": [
      {
        "id": "lu-geography-continent",
        "category": "geography",
        "vi": "Luxembourg nằm ở Châu Âu.",
        "en": "Luxembourg is in Europe.",
        "question": "Luxembourg nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "lu-capital-luxembourg",
        "category": "capital",
        "vi": "Thủ đô của Luxembourg là Luxembourg.",
        "en": "The capital of Luxembourg is Luxembourg.",
        "question": "Thủ đô của Luxembourg là thành phố nào?",
        "answers": [
          "Luxembourg",
          "Esch-sur-Alzette",
          "Differdange",
          "Paris"
        ]
      },
      {
        "id": "lu-geography-landlocked",
        "category": "geography",
        "vi": "Luxembourg không giáp biển.",
        "en": "Luxembourg is landlocked.",
        "question": "Điều nào đúng về Luxembourg?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "lu-geography-small",
        "category": "geography",
        "vi": "Luxembourg là một quốc gia nhỏ không giáp biển ở Tây Âu.",
        "en": "Luxembourg is a small landlocked country in Western Europe.",
        "question": "Luxembourg có đặc điểm nào?",
        "answers": [
          "Nhỏ và không giáp biển",
          "Là quốc gia đảo",
          "Lớn nhất châu Âu",
          "Nằm ở châu Đại Dương"
        ]
      }
    ]
  },
  {
    "id": "mt",
    "isoCode": "MT",
    "name": "Malta",
    "officialName": "Cộng hòa Malta",
    "nameEn": "Malta",
    "officialNameEn": "Republic of Malta",
    "flag": "🇲🇹",
    "capital": "Valletta",
    "capitalEn": "Valletta",
    "continent": "europe",
    "region": "Nam Âu",
    "subRegion": "Địa Trung Hải",
    "languages": [
      "mt",
      "en"
    ],
    "currency": "Euro",
    "neighbors": [],
    "geo": "island",
    "landscape": "temperate",
    "flagColors": [
      "white",
      "red"
    ],
    "altCities": [
      "Mdina",
      "Sliema",
      "Birkirkara"
    ],
    "facts": [
      {
        "id": "mt-geography-continent",
        "category": "geography",
        "vi": "Malta nằm ở Châu Âu.",
        "en": "Malta is in Europe.",
        "question": "Malta nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "mt-capital-valletta",
        "category": "capital",
        "vi": "Thủ đô của Malta là Valletta.",
        "en": "The capital of Malta is Valletta.",
        "question": "Thủ đô của Malta là thành phố nào?",
        "answers": [
          "Valletta",
          "Mdina",
          "Sliema",
          "Birkirkara"
        ]
      },
      {
        "id": "mt-geography-island",
        "category": "geography",
        "vi": "Malta là một quốc gia đảo.",
        "en": "Malta is an island country.",
        "question": "Điều nào đúng về Malta?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "mt-geography-med",
        "category": "geography",
        "vi": "Malta là quốc gia đảo trên Địa Trung Hải.",
        "en": "Malta is an island country in the Mediterranean Sea.",
        "question": "Malta là đảo trên biển nào?",
        "answers": [
          "Địa Trung Hải",
          "Biển Baltic",
          "Thái Bình Dương",
          "Biển Bắc"
        ]
      }
    ]
  },
  {
    "id": "md",
    "isoCode": "MD",
    "name": "Moldova",
    "officialName": "Cộng hòa Moldova",
    "nameEn": "Moldova",
    "officialNameEn": "Republic of Moldova",
    "flag": "🇲🇩",
    "capital": "Chișinău",
    "capitalEn": "Chisinau",
    "continent": "europe",
    "region": "Đông Âu",
    "subRegion": "Đông Âu",
    "languages": [
      "ro"
    ],
    "currency": "Leu",
    "neighbors": [
      "ua",
      "ro"
    ],
    "geo": "landlocked",
    "landscape": "temperate",
    "flagColors": [
      "blue",
      "yellow",
      "red"
    ],
    "altCities": [
      "Bălți",
      "Tiraspol"
    ],
    "facts": [
      {
        "id": "md-geography-continent",
        "category": "geography",
        "vi": "Moldova nằm ở Châu Âu.",
        "en": "Moldova is in Europe.",
        "question": "Moldova nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "md-capital-chisinau",
        "category": "capital",
        "vi": "Thủ đô của Moldova là Chișinău.",
        "en": "The capital of Moldova is Chisinau.",
        "question": "Thủ đô của Moldova là thành phố nào?",
        "answers": [
          "Chișinău",
          "Bălți",
          "Tiraspol",
          "Paris"
        ]
      },
      {
        "id": "md-geography-landlocked",
        "category": "geography",
        "vi": "Moldova không giáp biển.",
        "en": "Moldova is landlocked.",
        "question": "Điều nào đúng về Moldova?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "md-language-ro",
        "category": "language",
        "vi": "Người dân Moldova nói tiếng Romania.",
        "en": "People in Moldova speak tiếng Romania.",
        "question": "Người dân Moldova nói ngôn ngữ nào?",
        "answers": [
          "tiếng Romania",
          "tiếng Việt",
          "tiếng Nhật",
          "tiếng Inuit"
        ]
      }
    ]
  },
  {
    "id": "mc",
    "isoCode": "MC",
    "name": "Monaco",
    "officialName": "Công quốc Monaco",
    "nameEn": "Monaco",
    "officialNameEn": "Principality of Monaco",
    "flag": "🇲🇨",
    "capital": "Monaco",
    "capitalEn": "Monaco",
    "continent": "europe",
    "region": "Tây Âu",
    "subRegion": "Côte d'Azur",
    "languages": [
      "fr"
    ],
    "currency": "Euro",
    "neighbors": [
      "fr"
    ],
    "geo": "coastal",
    "landscape": "city",
    "flagColors": [
      "red",
      "white"
    ],
    "altCities": [
      "Monte Carlo",
      "La Condamine"
    ],
    "facts": [
      {
        "id": "mc-geography-continent",
        "category": "geography",
        "vi": "Monaco nằm ở Châu Âu.",
        "en": "Monaco is in Europe.",
        "question": "Monaco nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "mc-capital-monaco",
        "category": "capital",
        "vi": "Thủ đô của Monaco là Monaco.",
        "en": "The capital of Monaco is Monaco.",
        "question": "Thủ đô của Monaco là thành phố nào?",
        "answers": [
          "Monaco",
          "Monte Carlo",
          "La Condamine",
          "Paris"
        ]
      },
      {
        "id": "mc-geography-coast",
        "category": "geography",
        "vi": "Monaco giáp Địa Trung Hải.",
        "en": "Monaco borders the Địa Trung Hải.",
        "question": "Monaco giáp biển hoặc đại dương nào?",
        "answers": [
          "Địa Trung Hải",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "mc-geography-tiny",
        "category": "geography",
        "vi": "Monaco là một trong những quốc gia nhỏ nhất châu Âu.",
        "en": "Monaco is one of the smallest countries in Europe.",
        "question": "Monaco thuộc loại quốc gia nào?",
        "answers": [
          "Quốc gia rất nhỏ",
          "Quốc gia lớn nhất châu Âu",
          "Quốc gia đảo Thái Bình Dương",
          "Quốc gia không có thành phố"
        ]
      }
    ]
  },
  {
    "id": "me",
    "isoCode": "ME",
    "name": "Montenegro",
    "officialName": "Montenegro",
    "nameEn": "Montenegro",
    "officialNameEn": "Montenegro",
    "flag": "🇲🇪",
    "capital": "Podgorica",
    "capitalEn": "Podgorica",
    "continent": "europe",
    "region": "Nam Âu",
    "subRegion": "Balkan",
    "languages": [
      "sr"
    ],
    "currency": "Euro",
    "neighbors": [
      "hr",
      "ba",
      "rs",
      "al"
    ],
    "geo": "coastal",
    "landscape": "mountain",
    "flagColors": [
      "red",
      "yellow"
    ],
    "altCities": [
      "Budva",
      "Kotor",
      "Nikšić"
    ],
    "facts": [
      {
        "id": "me-geography-continent",
        "category": "geography",
        "vi": "Montenegro nằm ở Châu Âu.",
        "en": "Montenegro is in Europe.",
        "question": "Montenegro nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "me-capital-podgorica",
        "category": "capital",
        "vi": "Thủ đô của Montenegro là Podgorica.",
        "en": "The capital of Montenegro is Podgorica.",
        "question": "Thủ đô của Montenegro là thành phố nào?",
        "answers": [
          "Podgorica",
          "Budva",
          "Kotor",
          "Nikšić"
        ]
      },
      {
        "id": "me-geography-coast",
        "category": "geography",
        "vi": "Montenegro giáp Biển Adriatic.",
        "en": "Montenegro borders the Biển Adriatic.",
        "question": "Montenegro giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Adriatic",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "me-geography-adriatic",
        "category": "geography",
        "vi": "Montenegro có bờ biển Adriatic với vịnh và núi.",
        "en": "Montenegro has an Adriatic coast with bays and mountains.",
        "question": "Montenegro giáp biển nào?",
        "answers": [
          "Biển Adriatic",
          "Biển Baltic",
          "Biển Đỏ",
          "Thái Bình Dương"
        ]
      }
    ]
  },
  {
    "id": "nl",
    "isoCode": "NL",
    "name": "Hà Lan",
    "officialName": "Vương quốc Hà Lan",
    "nameEn": "Netherlands",
    "officialNameEn": "Kingdom of the Netherlands",
    "flag": "🇳🇱",
    "capital": "Amsterdam",
    "capitalEn": "Amsterdam",
    "continent": "europe",
    "region": "Tây Âu",
    "subRegion": "Low Countries",
    "languages": [
      "nl"
    ],
    "currency": "Euro",
    "neighbors": [
      "de",
      "be"
    ],
    "geo": "coastal",
    "landscape": "temperate",
    "flagColors": [
      "red",
      "white",
      "blue"
    ],
    "altCities": [
      "Rotterdam",
      "The Hague",
      "Utrecht"
    ],
    "facts": [
      {
        "id": "nl-geography-continent",
        "category": "geography",
        "vi": "Hà Lan nằm ở Châu Âu.",
        "en": "Netherlands is in Europe.",
        "question": "Hà Lan nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "nl-capital-amsterdam",
        "category": "capital",
        "vi": "Thủ đô của Hà Lan là Amsterdam.",
        "en": "The capital of Netherlands is Amsterdam.",
        "question": "Thủ đô của Hà Lan là thành phố nào?",
        "answers": [
          "Amsterdam",
          "Rotterdam",
          "The Hague",
          "Utrecht"
        ]
      },
      {
        "id": "nl-geography-coast",
        "category": "geography",
        "vi": "Hà Lan giáp Biển Bắc.",
        "en": "Netherlands borders the Biển Bắc.",
        "question": "Hà Lan giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Bắc",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "nl-culture-tulip",
        "category": "culture",
        "vi": "Hà Lan nổi tiếng với hoa tulip và cối xay gió.",
        "en": "The Netherlands is famous for tulips and windmills.",
        "question": "Loài hoa nổi tiếng của Hà Lan là gì?",
        "answers": [
          "Hoa tulip",
          "Hoa anh đào",
          "Hoa hướng dương",
          "Hoa sen"
        ]
      }
    ]
  },
  {
    "id": "mk",
    "isoCode": "MK",
    "name": "Bắc Macedonia",
    "officialName": "Cộng hòa Bắc Macedonia",
    "nameEn": "North Macedonia",
    "officialNameEn": "Republic of North Macedonia",
    "flag": "🇲🇰",
    "capital": "Skopje",
    "capitalEn": "Skopje",
    "continent": "europe",
    "region": "Nam Âu",
    "subRegion": "Balkan",
    "languages": [
      "mk"
    ],
    "currency": "Denar",
    "neighbors": [
      "rs",
      "bg",
      "gr",
      "al"
    ],
    "geo": "landlocked",
    "landscape": "mountain",
    "flagColors": [
      "red",
      "yellow"
    ],
    "altCities": [
      "Bitola",
      "Ohrid",
      "Kumanovo"
    ],
    "facts": [
      {
        "id": "mk-geography-continent",
        "category": "geography",
        "vi": "Bắc Macedonia nằm ở Châu Âu.",
        "en": "North Macedonia is in Europe.",
        "question": "Bắc Macedonia nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "mk-capital-skopje",
        "category": "capital",
        "vi": "Thủ đô của Bắc Macedonia là Skopje.",
        "en": "The capital of North Macedonia is Skopje.",
        "question": "Thủ đô của Bắc Macedonia là thành phố nào?",
        "answers": [
          "Skopje",
          "Bitola",
          "Ohrid",
          "Kumanovo"
        ]
      },
      {
        "id": "mk-geography-landlocked",
        "category": "geography",
        "vi": "Bắc Macedonia không giáp biển.",
        "en": "North Macedonia is landlocked.",
        "question": "Điều nào đúng về Bắc Macedonia?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "mk-nature-ohrid",
        "category": "nature",
        "vi": "Hồ Ohrid là hồ cổ nổi tiếng ở Bắc Macedonia.",
        "en": "Lake Ohrid is a famous ancient lake in North Macedonia.",
        "question": "Hồ cổ nổi tiếng ở Bắc Macedonia tên là gì?",
        "answers": [
          "Hồ Ohrid",
          "Hồ Baikal",
          "Biển Chết",
          "Hồ Superior"
        ]
      }
    ]
  },
  {
    "id": "no",
    "isoCode": "NO",
    "name": "Na Uy",
    "officialName": "Vương quốc Na Uy",
    "nameEn": "Norway",
    "officialNameEn": "Kingdom of Norway",
    "flag": "🇳🇴",
    "capital": "Oslo",
    "capitalEn": "Oslo",
    "continent": "europe",
    "region": "Bắc Âu",
    "subRegion": "Bán đảo Scandinavia",
    "languages": [
      "no"
    ],
    "currency": "Krone",
    "neighbors": [
      "se",
      "fi",
      "ru"
    ],
    "geo": "coastal",
    "landscape": "arctic",
    "flagColors": [
      "red",
      "white",
      "blue"
    ],
    "altCities": [
      "Bergen",
      "Trondheim",
      "Stavanger"
    ],
    "facts": [
      {
        "id": "no-geography-continent",
        "category": "geography",
        "vi": "Na Uy nằm ở Châu Âu.",
        "en": "Norway is in Europe.",
        "question": "Na Uy nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "no-capital-oslo",
        "category": "capital",
        "vi": "Thủ đô của Na Uy là Oslo.",
        "en": "The capital of Norway is Oslo.",
        "question": "Thủ đô của Na Uy là thành phố nào?",
        "answers": [
          "Oslo",
          "Bergen",
          "Trondheim",
          "Stavanger"
        ]
      },
      {
        "id": "no-geography-coast",
        "category": "geography",
        "vi": "Na Uy giáp Biển Bắc.",
        "en": "Norway borders the Biển Bắc.",
        "question": "Na Uy giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Bắc",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "no-nature-fjord",
        "category": "nature",
        "vi": "Na Uy có nhiều vịnh hẹp fjord giữa núi và biển.",
        "en": "Norway has many narrow fjords between mountains and the sea.",
        "question": "Na Uy nổi tiếng với dạng vịnh núi nào?",
        "answers": [
          "Fjord",
          "Sông Nile",
          "Hồ muối",
          "Suối sa mạc"
        ]
      }
    ]
  },
  {
    "id": "pl",
    "isoCode": "PL",
    "name": "Ba Lan",
    "officialName": "Cộng hòa Ba Lan",
    "nameEn": "Poland",
    "officialNameEn": "Republic of Poland",
    "flag": "🇵🇱",
    "capital": "Warsaw",
    "capitalEn": "Warsaw",
    "continent": "europe",
    "region": "Đông Âu",
    "subRegion": "Đồng bằng Trung Âu",
    "languages": [
      "pl"
    ],
    "currency": "Złoty",
    "neighbors": [
      "de",
      "cz",
      "sk",
      "ua",
      "by",
      "lt",
      "ru"
    ],
    "geo": "coastal",
    "landscape": "temperate",
    "flagColors": [
      "white",
      "red"
    ],
    "altCities": [
      "Kraków",
      "Gdańsk",
      "Wrocław",
      "Poznań"
    ],
    "facts": [
      {
        "id": "pl-geography-continent",
        "category": "geography",
        "vi": "Ba Lan nằm ở Châu Âu.",
        "en": "Poland is in Europe.",
        "question": "Ba Lan nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "pl-capital-warsaw",
        "category": "capital",
        "vi": "Thủ đô của Ba Lan là Warsaw.",
        "en": "The capital of Poland is Warsaw.",
        "question": "Thủ đô của Ba Lan là thành phố nào?",
        "answers": [
          "Warsaw",
          "Kraków",
          "Gdańsk",
          "Wrocław"
        ]
      },
      {
        "id": "pl-geography-coast",
        "category": "geography",
        "vi": "Ba Lan giáp Biển Baltic.",
        "en": "Poland borders the Biển Baltic.",
        "question": "Ba Lan giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Baltic",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "pl-geography-baltic",
        "category": "geography",
        "vi": "Ba Lan giáp Biển Baltic ở phía bắc.",
        "en": "Poland meets the Baltic Sea in the north.",
        "question": "Ba Lan giáp biển nào ở phía bắc?",
        "answers": [
          "Biển Baltic",
          "Địa Trung Hải",
          "Biển Đỏ",
          "Thái Bình Dương"
        ]
      }
    ]
  },
  {
    "id": "pt",
    "isoCode": "PT",
    "name": "Bồ Đào Nha",
    "officialName": "Cộng hòa Bồ Đào Nha",
    "nameEn": "Portugal",
    "officialNameEn": "Portuguese Republic",
    "flag": "🇵🇹",
    "capital": "Lisbon",
    "capitalEn": "Lisbon",
    "continent": "europe",
    "region": "Nam Âu",
    "subRegion": "Bán đảo Iberia",
    "languages": [
      "pt"
    ],
    "currency": "Euro",
    "neighbors": [
      "es"
    ],
    "geo": "coastal",
    "landscape": "temperate",
    "flagColors": [
      "green",
      "red"
    ],
    "altCities": [
      "Porto",
      "Faro",
      "Coimbra",
      "Braga"
    ],
    "facts": [
      {
        "id": "pt-geography-continent",
        "category": "geography",
        "vi": "Bồ Đào Nha nằm ở Châu Âu.",
        "en": "Portugal is in Europe.",
        "question": "Bồ Đào Nha nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "pt-capital-lisbon",
        "category": "capital",
        "vi": "Thủ đô của Bồ Đào Nha là Lisbon.",
        "en": "The capital of Portugal is Lisbon.",
        "question": "Thủ đô của Bồ Đào Nha là thành phố nào?",
        "answers": [
          "Lisbon",
          "Porto",
          "Faro",
          "Coimbra"
        ]
      },
      {
        "id": "pt-geography-coast",
        "category": "geography",
        "vi": "Bồ Đào Nha giáp Đại Tây Dương.",
        "en": "Portugal borders the Đại Tây Dương.",
        "question": "Bồ Đào Nha giáp biển hoặc đại dương nào?",
        "answers": [
          "Đại Tây Dương",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "pt-geography-atlantic",
        "category": "geography",
        "vi": "Bồ Đào Nha nằm ở bờ Đại Tây Dương của châu Âu.",
        "en": "Portugal sits on Europe's Atlantic coast.",
        "question": "Bồ Đào Nha giáp đại dương nào?",
        "answers": [
          "Đại Tây Dương",
          "Thái Bình Dương",
          "Ấn Độ Dương",
          "Bắc Băng Dương"
        ]
      }
    ]
  },
  {
    "id": "ro",
    "isoCode": "RO",
    "name": "Romania",
    "officialName": "Romania",
    "nameEn": "Romania",
    "officialNameEn": "Romania",
    "flag": "🇷🇴",
    "capital": "Bucharest",
    "capitalEn": "Bucharest",
    "continent": "europe",
    "region": "Đông Âu",
    "subRegion": "Carpath",
    "languages": [
      "ro"
    ],
    "currency": "Leu",
    "neighbors": [
      "ua",
      "md",
      "bg",
      "rs",
      "hu"
    ],
    "geo": "coastal",
    "landscape": "temperate",
    "flagColors": [
      "blue",
      "yellow",
      "red"
    ],
    "altCities": [
      "Cluj-Napoca",
      "Timișoara",
      "Iași",
      "Constanța"
    ],
    "facts": [
      {
        "id": "ro-geography-continent",
        "category": "geography",
        "vi": "Romania nằm ở Châu Âu.",
        "en": "Romania is in Europe.",
        "question": "Romania nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "ro-capital-bucharest",
        "category": "capital",
        "vi": "Thủ đô của Romania là Bucharest.",
        "en": "The capital of Romania is Bucharest.",
        "question": "Thủ đô của Romania là thành phố nào?",
        "answers": [
          "Bucharest",
          "Cluj-Napoca",
          "Timișoara",
          "Iași"
        ]
      },
      {
        "id": "ro-geography-coast",
        "category": "geography",
        "vi": "Romania giáp Biển Đen.",
        "en": "Romania borders the Biển Đen.",
        "question": "Romania giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Đen",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "ro-nature-carpathian",
        "category": "nature",
        "vi": "Dãy Carpath chạy qua Romania.",
        "en": "The Carpathian Mountains run through Romania.",
        "question": "Dãy núi lớn chạy qua Romania tên là gì?",
        "answers": [
          "Carpath",
          "Alps",
          "Andes",
          "Atlas"
        ]
      }
    ]
  },
  {
    "id": "ru",
    "isoCode": "RU",
    "name": "Nga",
    "officialName": "Liên bang Nga",
    "nameEn": "Russia",
    "officialNameEn": "Russian Federation",
    "flag": "🇷🇺",
    "capital": "Moskva",
    "capitalEn": "Moscow",
    "continent": "europe",
    "region": "Đông Âu",
    "subRegion": "Đông Âu – Bắc Á",
    "languages": [
      "ru"
    ],
    "currency": "Ruble",
    "neighbors": [
      "no",
      "fi",
      "ee",
      "lv",
      "lt",
      "pl",
      "by",
      "ua",
      "ge",
      "az",
      "kz",
      "cn",
      "mn",
      "kp"
    ],
    "geo": "coastal",
    "landscape": "temperate",
    "flagColors": [
      "white",
      "blue",
      "red"
    ],
    "altCities": [
      "Saint Petersburg",
      "Novosibirsk",
      "Kazan",
      "Yekaterinburg"
    ],
    "facts": [
      {
        "id": "ru-geography-continent",
        "category": "geography",
        "vi": "Nga nằm ở Châu Âu.",
        "en": "Russia is in Europe.",
        "question": "Nga nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "ru-capital-moscow",
        "category": "capital",
        "vi": "Thủ đô của Nga là Moskva.",
        "en": "The capital of Russia is Moscow.",
        "question": "Thủ đô của Nga là thành phố nào?",
        "answers": [
          "Moskva",
          "Saint Petersburg",
          "Novosibirsk",
          "Kazan"
        ]
      },
      {
        "id": "ru-geography-coast",
        "category": "geography",
        "vi": "Nga giáp Bắc Băng Dương.",
        "en": "Russia borders the Bắc Băng Dương.",
        "question": "Nga giáp biển hoặc đại dương nào?",
        "answers": [
          "Bắc Băng Dương",
          "Địa Trung Hải",
          "Thái Bình Dương",
          "Ấn Độ Dương"
        ]
      },
      {
        "id": "ru-geography-largest",
        "category": "geography",
        "vi": "Nga là quốc gia có diện tích lớn nhất thế giới.",
        "en": "Russia is the largest country on Earth by area.",
        "question": "Quốc gia lớn nhất thế giới về diện tích là nước nào?",
        "answers": [
          "Nga",
          "Canada",
          "Trung Quốc",
          "Mỹ"
        ]
      },
      {
        "id": "ru-nature-baikal",
        "category": "nature",
        "vi": "Hồ Baikal ở Nga là hồ nước ngọt sâu nhất thế giới.",
        "en": "Lake Baikal in Russia is the world's deepest freshwater lake.",
        "question": "Hồ nước ngọt sâu nhất thế giới ở Nga tên là gì?",
        "answers": [
          "Hồ Baikal",
          "Hồ Victoria",
          "Hồ Superior",
          "Biển Chết"
        ]
      }
    ]
  },
  {
    "id": "sm",
    "isoCode": "SM",
    "name": "San Marino",
    "officialName": "Cộng hòa San Marino",
    "nameEn": "San Marino",
    "officialNameEn": "Republic of San Marino",
    "flag": "🇸🇲",
    "capital": "San Marino",
    "capitalEn": "San Marino",
    "continent": "europe",
    "region": "Nam Âu",
    "subRegion": "Bán đảo Ý",
    "languages": [
      "it"
    ],
    "currency": "Euro",
    "neighbors": [
      "it"
    ],
    "geo": "landlocked",
    "landscape": "mountain",
    "flagColors": [
      "white",
      "blue"
    ],
    "altCities": [
      "Serravalle",
      "Borgo Maggiore"
    ],
    "facts": [
      {
        "id": "sm-geography-continent",
        "category": "geography",
        "vi": "San Marino nằm ở Châu Âu.",
        "en": "San Marino is in Europe.",
        "question": "San Marino nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "sm-capital-san-marino",
        "category": "capital",
        "vi": "Thủ đô của San Marino là San Marino.",
        "en": "The capital of San Marino is San Marino.",
        "question": "Thủ đô của San Marino là thành phố nào?",
        "answers": [
          "San Marino",
          "Serravalle",
          "Borgo Maggiore",
          "Paris"
        ]
      },
      {
        "id": "sm-geography-landlocked",
        "category": "geography",
        "vi": "San Marino không giáp biển.",
        "en": "San Marino is landlocked.",
        "question": "Điều nào đúng về San Marino?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "sm-geography-tiny",
        "category": "geography",
        "vi": "San Marino là một quốc gia nhỏ nằm trên núi, bên trong nước Ý.",
        "en": "San Marino is a tiny mountain country inside Italy.",
        "question": "San Marino nằm bên trong nước nào?",
        "answers": [
          "Ý",
          "Pháp",
          "Tây Ban Nha",
          "Đức"
        ]
      }
    ]
  },
  {
    "id": "rs",
    "isoCode": "RS",
    "name": "Serbia",
    "officialName": "Cộng hòa Serbia",
    "nameEn": "Serbia",
    "officialNameEn": "Republic of Serbia",
    "flag": "🇷🇸",
    "capital": "Belgrade",
    "capitalEn": "Belgrade",
    "continent": "europe",
    "region": "Nam Âu",
    "subRegion": "Balkan",
    "languages": [
      "sr"
    ],
    "currency": "Dinar",
    "neighbors": [
      "hu",
      "ro",
      "bg",
      "mk",
      "me",
      "ba",
      "hr"
    ],
    "geo": "landlocked",
    "landscape": "temperate",
    "flagColors": [
      "red",
      "blue",
      "white"
    ],
    "altCities": [
      "Novi Sad",
      "Niš",
      "Kragujevac"
    ],
    "facts": [
      {
        "id": "rs-geography-continent",
        "category": "geography",
        "vi": "Serbia nằm ở Châu Âu.",
        "en": "Serbia is in Europe.",
        "question": "Serbia nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "rs-capital-belgrade",
        "category": "capital",
        "vi": "Thủ đô của Serbia là Belgrade.",
        "en": "The capital of Serbia is Belgrade.",
        "question": "Thủ đô của Serbia là thành phố nào?",
        "answers": [
          "Belgrade",
          "Novi Sad",
          "Niš",
          "Kragujevac"
        ]
      },
      {
        "id": "rs-geography-landlocked",
        "category": "geography",
        "vi": "Serbia không giáp biển.",
        "en": "Serbia is landlocked.",
        "question": "Điều nào đúng về Serbia?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "rs-geography-danube",
        "category": "geography",
        "vi": "Sông Danube chảy qua thủ đô Belgrade của Serbia.",
        "en": "The Danube River flows through Belgrade, Serbia.",
        "question": "Con sông chảy qua Belgrade tên là gì?",
        "answers": [
          "Sông Danube",
          "Sông Nile",
          "Sông Amazon",
          "Sông Mekong"
        ]
      }
    ]
  },
  {
    "id": "sk",
    "isoCode": "SK",
    "name": "Slovakia",
    "officialName": "Cộng hòa Slovakia",
    "nameEn": "Slovakia",
    "officialNameEn": "Slovak Republic",
    "flag": "🇸🇰",
    "capital": "Bratislava",
    "capitalEn": "Bratislava",
    "continent": "europe",
    "region": "Trung Âu",
    "subRegion": "Carpath",
    "languages": [
      "sk"
    ],
    "currency": "Euro",
    "neighbors": [
      "cz",
      "pl",
      "ua",
      "hu",
      "at"
    ],
    "geo": "landlocked",
    "landscape": "mountain",
    "flagColors": [
      "white",
      "blue",
      "red"
    ],
    "altCities": [
      "Košice",
      "Žilina",
      "Prešov"
    ],
    "facts": [
      {
        "id": "sk-geography-continent",
        "category": "geography",
        "vi": "Slovakia nằm ở Châu Âu.",
        "en": "Slovakia is in Europe.",
        "question": "Slovakia nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "sk-capital-bratislava",
        "category": "capital",
        "vi": "Thủ đô của Slovakia là Bratislava.",
        "en": "The capital of Slovakia is Bratislava.",
        "question": "Thủ đô của Slovakia là thành phố nào?",
        "answers": [
          "Bratislava",
          "Košice",
          "Žilina",
          "Prešov"
        ]
      },
      {
        "id": "sk-geography-landlocked",
        "category": "geography",
        "vi": "Slovakia không giáp biển.",
        "en": "Slovakia is landlocked.",
        "question": "Điều nào đúng về Slovakia?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "sk-nature-tatra",
        "category": "nature",
        "vi": "Dãy Tatra là núi cao nổi tiếng ở Slovakia.",
        "en": "The Tatra Mountains are famous high peaks in Slovakia.",
        "question": "Dãy núi nổi tiếng ở Slovakia tên là gì?",
        "answers": [
          "Tatra",
          "Andes",
          "Atlas",
          "Kilimanjaro"
        ]
      }
    ]
  },
  {
    "id": "si",
    "isoCode": "SI",
    "name": "Slovenia",
    "officialName": "Cộng hòa Slovenia",
    "nameEn": "Slovenia",
    "officialNameEn": "Republic of Slovenia",
    "flag": "🇸🇮",
    "capital": "Ljubljana",
    "capitalEn": "Ljubljana",
    "continent": "europe",
    "region": "Nam Âu",
    "subRegion": "Alps",
    "languages": [
      "sl"
    ],
    "currency": "Euro",
    "neighbors": [
      "at",
      "hu",
      "hr",
      "it"
    ],
    "geo": "coastal",
    "landscape": "mountain",
    "flagColors": [
      "white",
      "blue",
      "red"
    ],
    "altCities": [
      "Maribor",
      "Koper",
      "Bled"
    ],
    "facts": [
      {
        "id": "si-geography-continent",
        "category": "geography",
        "vi": "Slovenia nằm ở Châu Âu.",
        "en": "Slovenia is in Europe.",
        "question": "Slovenia nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "si-capital-ljubljana",
        "category": "capital",
        "vi": "Thủ đô của Slovenia là Ljubljana.",
        "en": "The capital of Slovenia is Ljubljana.",
        "question": "Thủ đô của Slovenia là thành phố nào?",
        "answers": [
          "Ljubljana",
          "Maribor",
          "Koper",
          "Bled"
        ]
      },
      {
        "id": "si-geography-coast",
        "category": "geography",
        "vi": "Slovenia giáp Biển Adriatic.",
        "en": "Slovenia borders the Biển Adriatic.",
        "question": "Slovenia giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Adriatic",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "si-geography-alps-sea",
        "category": "geography",
        "vi": "Slovenia vừa có núi Alps vừa có một đoạn bờ Adriatic.",
        "en": "Slovenia has both Alpine mountains and a short Adriatic coast.",
        "question": "Slovenia vừa có núi Alps vừa giáp biển nào?",
        "answers": [
          "Biển Adriatic",
          "Biển Baltic",
          "Biển Đỏ",
          "Thái Bình Dương"
        ]
      }
    ]
  },
  {
    "id": "es",
    "isoCode": "ES",
    "name": "Tây Ban Nha",
    "officialName": "Vương quốc Tây Ban Nha",
    "nameEn": "Spain",
    "officialNameEn": "Kingdom of Spain",
    "flag": "🇪🇸",
    "capital": "Madrid",
    "capitalEn": "Madrid",
    "continent": "europe",
    "region": "Nam Âu",
    "subRegion": "Bán đảo Iberia",
    "languages": [
      "es"
    ],
    "currency": "Euro",
    "neighbors": [
      "fr",
      "pt",
      "ad"
    ],
    "geo": "coastal",
    "landscape": "temperate",
    "flagColors": [
      "red",
      "yellow"
    ],
    "altCities": [
      "Barcelona",
      "Seville",
      "Valencia",
      "Bilbao"
    ],
    "facts": [
      {
        "id": "es-geography-continent",
        "category": "geography",
        "vi": "Tây Ban Nha nằm ở Châu Âu.",
        "en": "Spain is in Europe.",
        "question": "Tây Ban Nha nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "es-capital-madrid",
        "category": "capital",
        "vi": "Thủ đô của Tây Ban Nha là Madrid.",
        "en": "The capital of Spain is Madrid.",
        "question": "Thủ đô của Tây Ban Nha là thành phố nào?",
        "answers": [
          "Madrid",
          "Barcelona",
          "Seville",
          "Valencia"
        ]
      },
      {
        "id": "es-geography-coast",
        "category": "geography",
        "vi": "Tây Ban Nha giáp Địa Trung Hải.",
        "en": "Spain borders the Địa Trung Hải.",
        "question": "Tây Ban Nha giáp biển hoặc đại dương nào?",
        "answers": [
          "Địa Trung Hải",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "es-food-paella",
        "category": "food",
        "vi": "Paella là món cơm nổi tiếng của Tây Ban Nha.",
        "en": "Paella is a famous rice dish from Spain.",
        "question": "Món cơm nổi tiếng của Tây Ban Nha tên là gì?",
        "answers": [
          "Paella",
          "Sushi",
          "Phở",
          "Kimchi"
        ]
      }
    ]
  },
  {
    "id": "se",
    "isoCode": "SE",
    "name": "Thụy Điển",
    "officialName": "Vương quốc Thụy Điển",
    "nameEn": "Sweden",
    "officialNameEn": "Kingdom of Sweden",
    "flag": "🇸🇪",
    "capital": "Stockholm",
    "capitalEn": "Stockholm",
    "continent": "europe",
    "region": "Bắc Âu",
    "subRegion": "Bán đảo Scandinavia",
    "languages": [
      "sv"
    ],
    "currency": "Krona",
    "neighbors": [
      "no",
      "fi"
    ],
    "geo": "coastal",
    "landscape": "temperate",
    "flagColors": [
      "blue",
      "yellow"
    ],
    "altCities": [
      "Gothenburg",
      "Malmö",
      "Uppsala"
    ],
    "facts": [
      {
        "id": "se-geography-continent",
        "category": "geography",
        "vi": "Thụy Điển nằm ở Châu Âu.",
        "en": "Sweden is in Europe.",
        "question": "Thụy Điển nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "se-capital-stockholm",
        "category": "capital",
        "vi": "Thủ đô của Thụy Điển là Stockholm.",
        "en": "The capital of Sweden is Stockholm.",
        "question": "Thủ đô của Thụy Điển là thành phố nào?",
        "answers": [
          "Stockholm",
          "Gothenburg",
          "Malmö",
          "Uppsala"
        ]
      },
      {
        "id": "se-geography-coast",
        "category": "geography",
        "vi": "Thụy Điển giáp Biển Baltic.",
        "en": "Sweden borders the Biển Baltic.",
        "question": "Thụy Điển giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Baltic",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "se-nature-aurora",
        "category": "nature",
        "vi": "Ở miền bắc Thụy Điển người ta có thể thấy cực quang.",
        "en": "In northern Sweden people can see the northern lights.",
        "question": "Hiện tượng ánh sáng trời ở miền bắc Thụy Điển tên là gì?",
        "answers": [
          "Cực quang",
          "Mống lửa",
          "Sao băng mỗi phút",
          "Nhật thực ban đêm"
        ]
      }
    ]
  },
  {
    "id": "ch",
    "isoCode": "CH",
    "name": "Thụy Sĩ",
    "officialName": "Liên bang Thụy Sĩ",
    "nameEn": "Switzerland",
    "officialNameEn": "Swiss Confederation",
    "flag": "🇨🇭",
    "capital": "Bern",
    "capitalEn": "Bern",
    "continent": "europe",
    "region": "Tây Âu",
    "subRegion": "Alps",
    "languages": [
      "de",
      "fr",
      "it"
    ],
    "currency": "Franc Thụy Sĩ",
    "neighbors": [
      "fr",
      "de",
      "at",
      "li",
      "it"
    ],
    "geo": "landlocked",
    "landscape": "mountain",
    "flagColors": [
      "red",
      "white"
    ],
    "altCities": [
      "Zurich",
      "Geneva",
      "Basel",
      "Lausanne"
    ],
    "facts": [
      {
        "id": "ch-geography-continent",
        "category": "geography",
        "vi": "Thụy Sĩ nằm ở Châu Âu.",
        "en": "Switzerland is in Europe.",
        "question": "Thụy Sĩ nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "ch-capital-bern",
        "category": "capital",
        "vi": "Thủ đô của Thụy Sĩ là Bern.",
        "en": "The capital of Switzerland is Bern.",
        "question": "Thủ đô của Thụy Sĩ là thành phố nào?",
        "answers": [
          "Bern",
          "Zurich",
          "Geneva",
          "Basel"
        ]
      },
      {
        "id": "ch-geography-landlocked",
        "category": "geography",
        "vi": "Thụy Sĩ không giáp biển.",
        "en": "Switzerland is landlocked.",
        "question": "Điều nào đúng về Thụy Sĩ?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "ch-nature-alps",
        "category": "nature",
        "vi": "Dãy Alps phủ tuyết chạy qua Thụy Sĩ.",
        "en": "The snowy Alps run through Switzerland.",
        "question": "Dãy núi tuyết nổi tiếng ở Thụy Sĩ tên là gì?",
        "answers": [
          "Alps",
          "Himalaya",
          "Andes",
          "Rocky"
        ]
      },
      {
        "id": "ch-food-chocolate",
        "category": "food",
        "vi": "Sô-cô-la Thụy Sĩ rất nổi tiếng trên thế giới.",
        "en": "Swiss chocolate is famous around the world.",
        "question": "Thụy Sĩ nổi tiếng với món ngọt nào?",
        "answers": [
          "Sô-cô-la",
          "Sushi",
          "Phở",
          "Taco"
        ]
      }
    ]
  },
  {
    "id": "ua",
    "isoCode": "UA",
    "name": "Ukraina",
    "officialName": "Ukraina",
    "nameEn": "Ukraine",
    "officialNameEn": "Ukraine",
    "flag": "🇺🇦",
    "capital": "Kyiv",
    "capitalEn": "Kyiv",
    "continent": "europe",
    "region": "Đông Âu",
    "subRegion": "Đông Âu",
    "languages": [
      "uk"
    ],
    "currency": "Hryvnia",
    "neighbors": [
      "pl",
      "sk",
      "hu",
      "ro",
      "md",
      "ru",
      "by"
    ],
    "geo": "coastal",
    "landscape": "temperate",
    "flagColors": [
      "blue",
      "yellow"
    ],
    "altCities": [
      "Lviv",
      "Odesa",
      "Kharkiv",
      "Dnipro"
    ],
    "facts": [
      {
        "id": "ua-geography-continent",
        "category": "geography",
        "vi": "Ukraina nằm ở Châu Âu.",
        "en": "Ukraine is in Europe.",
        "question": "Ukraina nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "ua-capital-kyiv",
        "category": "capital",
        "vi": "Thủ đô của Ukraina là Kyiv.",
        "en": "The capital of Ukraine is Kyiv.",
        "question": "Thủ đô của Ukraina là thành phố nào?",
        "answers": [
          "Kyiv",
          "Lviv",
          "Odesa",
          "Kharkiv"
        ]
      },
      {
        "id": "ua-geography-coast",
        "category": "geography",
        "vi": "Ukraina giáp Biển Đen.",
        "en": "Ukraine borders the Biển Đen.",
        "question": "Ukraina giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Đen",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "ua-geography-wheat",
        "category": "geography",
        "vi": "Ukraina có đồng lúa mì rất rộng và màu mỡ.",
        "en": "Ukraine has very wide, fertile wheat fields.",
        "question": "Ukraina nổi tiếng với cánh đồng cây gì?",
        "answers": [
          "Lúa mì",
          "Cây dừa",
          "Xương rồng",
          "Tre"
        ]
      }
    ]
  },
  {
    "id": "gb",
    "isoCode": "GB",
    "name": "Anh",
    "officialName": "Vương quốc Liên hiệp Anh và Bắc Ireland",
    "nameEn": "United Kingdom",
    "officialNameEn": "United Kingdom of Great Britain and Northern Ireland",
    "flag": "🇬🇧",
    "capital": "Luân Đôn",
    "capitalEn": "London",
    "continent": "europe",
    "region": "Bắc Âu",
    "subRegion": "Quần đảo Anh",
    "languages": [
      "en"
    ],
    "currency": "Bảng Anh",
    "neighbors": [
      "ie"
    ],
    "geo": "island",
    "landscape": "temperate",
    "flagColors": [
      "red",
      "white",
      "blue"
    ],
    "altCities": [
      "Manchester",
      "Edinburgh",
      "Birmingham",
      "Liverpool"
    ],
    "facts": [
      {
        "id": "gb-geography-continent",
        "category": "geography",
        "vi": "Anh nằm ở Châu Âu.",
        "en": "United Kingdom is in Europe.",
        "question": "Anh nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "gb-capital-london",
        "category": "capital",
        "vi": "Thủ đô của Anh là Luân Đôn.",
        "en": "The capital of United Kingdom is London.",
        "question": "Thủ đô của Anh là thành phố nào?",
        "answers": [
          "Luân Đôn",
          "Manchester",
          "Edinburgh",
          "Birmingham"
        ]
      },
      {
        "id": "gb-geography-island",
        "category": "geography",
        "vi": "Anh là một quốc gia đảo.",
        "en": "United Kingdom is an island country.",
        "question": "Điều nào đúng về Anh?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "gb-landmarks-bigben",
        "category": "landmarks",
        "vi": "Đồng hồ Big Ben nổi tiếng đứng ở Luân Đôn.",
        "en": "Big Ben is a famous clock in London.",
        "question": "Đồng hồ nổi tiếng ở Luân Đôn tên là gì?",
        "answers": [
          "Big Ben",
          "Tháp Eiffel",
          "Tháp Pisa",
          "Tượng Nữ thần Tự do"
        ]
      }
    ]
  },
  {
    "id": "va",
    "isoCode": "VA",
    "name": "Tòa Thánh",
    "officialName": "Tòa Thánh",
    "nameEn": "Holy See",
    "officialNameEn": "Holy See",
    "flag": "🇻🇦",
    "capital": "Thành Vatican",
    "capitalEn": "Vatican City",
    "continent": "europe",
    "region": "Nam Âu",
    "subRegion": "Roma",
    "languages": [
      "it",
      "la"
    ],
    "currency": "Euro",
    "neighbors": [
      "it"
    ],
    "geo": "landlocked",
    "landscape": "city",
    "flagColors": [
      "yellow",
      "white"
    ],
    "altCities": [
      "Thành Vatican"
    ],
    "facts": [
      {
        "id": "va-geography-continent",
        "category": "geography",
        "vi": "Tòa Thánh nằm ở Châu Âu.",
        "en": "Holy See is in Europe.",
        "question": "Tòa Thánh nằm ở châu lục nào?",
        "answers": [
          "Châu Âu",
          "Châu Á",
          "Châu Phi",
          "Bắc Mỹ"
        ]
      },
      {
        "id": "va-capital-vatican-city",
        "category": "capital",
        "vi": "Thủ đô của Tòa Thánh là Thành Vatican.",
        "en": "The capital of Holy See is Vatican City.",
        "question": "Thủ đô của Tòa Thánh là thành phố nào?",
        "answers": [
          "Thành Vatican",
          "Paris",
          "Tokyo",
          "Cairo"
        ]
      },
      {
        "id": "va-geography-landlocked",
        "category": "geography",
        "vi": "Tòa Thánh không giáp biển.",
        "en": "Holy See is landlocked.",
        "question": "Điều nào đúng về Tòa Thánh?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "va-geography-tiny",
        "category": "geography",
        "vi": "Tòa Thánh là quốc gia độc lập nhỏ nhất thế giới.",
        "en": "The Holy See is the world's smallest independent country.",
        "question": "Quốc gia độc lập nhỏ nhất thế giới là nước nào?",
        "answers": [
          "Tòa Thánh",
          "Monaco",
          "Nauru",
          "Singapore"
        ]
      },
      {
        "id": "va-landmarks-stpeter",
        "category": "landmarks",
        "vi": "Vương cung thánh đường Thánh Phêrô là công trình kiến trúc rất lớn ở Thành Vatican.",
        "en": "St. Peter's Basilica is a very large building in Vatican City.",
        "question": "Công trình kiến trúc rất lớn ở Thành Vatican tên là gì?",
        "answers": [
          "Vương cung thánh đường Thánh Phêrô",
          "Tháp Eiffel",
          "Colosseum",
          "Big Ben"
        ]
      }
    ]
  },
  {
    "id": "dz",
    "isoCode": "DZ",
    "name": "Algeria",
    "officialName": "Cộng hòa Dân chủ Nhân dân Algeria",
    "nameEn": "Algeria",
    "officialNameEn": "People's Democratic Republic of Algeria",
    "flag": "🇩🇿",
    "capital": "Algiers",
    "capitalEn": "Algiers",
    "continent": "africa",
    "region": "Bắc Phi",
    "subRegion": "Maghreb",
    "languages": [
      "ar"
    ],
    "currency": "Dinar",
    "neighbors": [
      "tn",
      "ly",
      "ne",
      "ml",
      "mr",
      "ma"
    ],
    "geo": "coastal",
    "landscape": "desert",
    "flagColors": [
      "green",
      "white",
      "red"
    ],
    "altCities": [
      "Oran",
      "Constantine",
      "Annaba"
    ],
    "facts": [
      {
        "id": "dz-geography-continent",
        "category": "geography",
        "vi": "Algeria nằm ở Châu Phi.",
        "en": "Algeria is in Africa.",
        "question": "Algeria nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "dz-capital-algiers",
        "category": "capital",
        "vi": "Thủ đô của Algeria là Algiers.",
        "en": "The capital of Algeria is Algiers.",
        "question": "Thủ đô của Algeria là thành phố nào?",
        "answers": [
          "Algiers",
          "Oran",
          "Constantine",
          "Annaba"
        ]
      },
      {
        "id": "dz-geography-coast",
        "category": "geography",
        "vi": "Algeria giáp Địa Trung Hải.",
        "en": "Algeria borders the Địa Trung Hải.",
        "question": "Algeria giáp biển hoặc đại dương nào?",
        "answers": [
          "Địa Trung Hải",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "dz-nature-sahara",
        "category": "nature",
        "vi": "Một phần rất lớn của Algeria là sa mạc Sahara.",
        "en": "A very large part of Algeria is the Sahara Desert.",
        "question": "Sa mạc lớn phủ nhiều phần Algeria tên là gì?",
        "answers": [
          "Sahara",
          "Gobi",
          "Namib",
          "Atacama"
        ]
      }
    ]
  },
  {
    "id": "ao",
    "isoCode": "AO",
    "name": "Angola",
    "officialName": "Cộng hòa Angola",
    "nameEn": "Angola",
    "officialNameEn": "Republic of Angola",
    "flag": "🇦🇴",
    "capital": "Luanda",
    "capitalEn": "Luanda",
    "continent": "africa",
    "region": "Trung Phi",
    "subRegion": "Bờ Tây Phi",
    "languages": [
      "pt"
    ],
    "currency": "Kwanza",
    "neighbors": [
      "cd",
      "zm",
      "na",
      "cg"
    ],
    "geo": "coastal",
    "landscape": "tropical",
    "flagColors": [
      "red",
      "black",
      "yellow"
    ],
    "altCities": [
      "Huambo",
      "Lobito",
      "Benguela"
    ],
    "facts": [
      {
        "id": "ao-geography-continent",
        "category": "geography",
        "vi": "Angola nằm ở Châu Phi.",
        "en": "Angola is in Africa.",
        "question": "Angola nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "ao-capital-luanda",
        "category": "capital",
        "vi": "Thủ đô của Angola là Luanda.",
        "en": "The capital of Angola is Luanda.",
        "question": "Thủ đô của Angola là thành phố nào?",
        "answers": [
          "Luanda",
          "Huambo",
          "Lobito",
          "Benguela"
        ]
      },
      {
        "id": "ao-geography-coast",
        "category": "geography",
        "vi": "Angola giáp Đại Tây Dương.",
        "en": "Angola borders the Đại Tây Dương.",
        "question": "Angola giáp biển hoặc đại dương nào?",
        "answers": [
          "Đại Tây Dương",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "ao-geography-atlantic",
        "category": "geography",
        "vi": "Angola nằm trên bờ Đại Tây Dương của châu Phi.",
        "en": "Angola sits on Africa's Atlantic coast.",
        "question": "Angola giáp đại dương nào?",
        "answers": [
          "Đại Tây Dương",
          "Thái Bình Dương",
          "Ấn Độ Dương",
          "Bắc Băng Dương"
        ]
      }
    ]
  },
  {
    "id": "bj",
    "isoCode": "BJ",
    "name": "Benin",
    "officialName": "Cộng hòa Benin",
    "nameEn": "Benin",
    "officialNameEn": "Republic of Benin",
    "flag": "🇧🇯",
    "capital": "Porto-Novo",
    "capitalEn": "Porto-Novo",
    "continent": "africa",
    "region": "Tây Phi",
    "subRegion": "Vịnh Guinea",
    "languages": [
      "fr"
    ],
    "currency": "Franc CFA",
    "neighbors": [
      "tg",
      "ng",
      "ne",
      "bf"
    ],
    "geo": "coastal",
    "landscape": "tropical",
    "flagColors": [
      "green",
      "yellow",
      "red"
    ],
    "altCities": [
      "Cotonou",
      "Parakou"
    ],
    "facts": [
      {
        "id": "bj-geography-continent",
        "category": "geography",
        "vi": "Benin nằm ở Châu Phi.",
        "en": "Benin is in Africa.",
        "question": "Benin nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "bj-capital-porto-novo",
        "category": "capital",
        "vi": "Thủ đô của Benin là Porto-Novo.",
        "en": "The capital of Benin is Porto-Novo.",
        "question": "Thủ đô của Benin là thành phố nào?",
        "answers": [
          "Porto-Novo",
          "Cotonou",
          "Parakou",
          "Paris"
        ]
      },
      {
        "id": "bj-geography-coast",
        "category": "geography",
        "vi": "Benin giáp Vịnh Guinea.",
        "en": "Benin borders the Vịnh Guinea.",
        "question": "Benin giáp biển hoặc đại dương nào?",
        "answers": [
          "Vịnh Guinea",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "bj-geography-gulf",
        "category": "geography",
        "vi": "Benin nằm trên Vịnh Guinea ở Tây Phi.",
        "en": "Benin sits on the Gulf of Guinea in West Africa.",
        "question": "Benin giáp vịnh nào?",
        "answers": [
          "Vịnh Guinea",
          "Vịnh Bengal",
          "Vịnh Mexico",
          "Vịnh Ba Tư"
        ]
      }
    ]
  },
  {
    "id": "bw",
    "isoCode": "BW",
    "name": "Botswana",
    "officialName": "Cộng hòa Botswana",
    "nameEn": "Botswana",
    "officialNameEn": "Republic of Botswana",
    "flag": "🇧🇼",
    "capital": "Gaborone",
    "capitalEn": "Gaborone",
    "continent": "africa",
    "region": "Nam Phi",
    "subRegion": "Kalahari",
    "languages": [
      "en",
      "tn"
    ],
    "currency": "Pula",
    "neighbors": [
      "na",
      "za",
      "zw",
      "zm"
    ],
    "geo": "landlocked",
    "landscape": "desert",
    "flagColors": [
      "blue",
      "white",
      "black"
    ],
    "altCities": [
      "Francistown",
      "Maun",
      "Kasane"
    ],
    "facts": [
      {
        "id": "bw-geography-continent",
        "category": "geography",
        "vi": "Botswana nằm ở Châu Phi.",
        "en": "Botswana is in Africa.",
        "question": "Botswana nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "bw-capital-gaborone",
        "category": "capital",
        "vi": "Thủ đô của Botswana là Gaborone.",
        "en": "The capital of Botswana is Gaborone.",
        "question": "Thủ đô của Botswana là thành phố nào?",
        "answers": [
          "Gaborone",
          "Francistown",
          "Maun",
          "Kasane"
        ]
      },
      {
        "id": "bw-geography-landlocked",
        "category": "geography",
        "vi": "Botswana không giáp biển.",
        "en": "Botswana is landlocked.",
        "question": "Điều nào đúng về Botswana?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "bw-nature-okavango",
        "category": "nature",
        "vi": "Đồng bằng ngập nước Okavango ở Botswana có nhiều động vật hoang dã.",
        "en": "The Okavango Delta in Botswana is home to many wild animals.",
        "question": "Đồng bằng ngập nước nổi tiếng ở Botswana tên là gì?",
        "answers": [
          "Okavango",
          "Amazon",
          "Nile",
          "Mekong"
        ]
      }
    ]
  },
  {
    "id": "bf",
    "isoCode": "BF",
    "name": "Burkina Faso",
    "officialName": "Burkina Faso",
    "nameEn": "Burkina Faso",
    "officialNameEn": "Burkina Faso",
    "flag": "🇧🇫",
    "capital": "Ouagadougou",
    "capitalEn": "Ouagadougou",
    "continent": "africa",
    "region": "Tây Phi",
    "subRegion": "Sahel",
    "languages": [
      "fr"
    ],
    "currency": "Franc CFA",
    "neighbors": [
      "ml",
      "ne",
      "bj",
      "tg",
      "gh",
      "ci"
    ],
    "geo": "landlocked",
    "landscape": "tropical",
    "flagColors": [
      "red",
      "green",
      "yellow"
    ],
    "altCities": [
      "Bobo-Dioulasso",
      "Koudougou"
    ],
    "facts": [
      {
        "id": "bf-geography-continent",
        "category": "geography",
        "vi": "Burkina Faso nằm ở Châu Phi.",
        "en": "Burkina Faso is in Africa.",
        "question": "Burkina Faso nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "bf-capital-ouagadougou",
        "category": "capital",
        "vi": "Thủ đô của Burkina Faso là Ouagadougou.",
        "en": "The capital of Burkina Faso is Ouagadougou.",
        "question": "Thủ đô của Burkina Faso là thành phố nào?",
        "answers": [
          "Ouagadougou",
          "Bobo-Dioulasso",
          "Koudougou",
          "Paris"
        ]
      },
      {
        "id": "bf-geography-landlocked",
        "category": "geography",
        "vi": "Burkina Faso không giáp biển.",
        "en": "Burkina Faso is landlocked.",
        "question": "Điều nào đúng về Burkina Faso?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "bf-geography-sahel",
        "category": "geography",
        "vi": "Burkina Faso nằm ở vùng Sahel, không giáp biển.",
        "en": "Burkina Faso is in the Sahel and has no coast.",
        "question": "Burkina Faso có đặc điểm nào?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm ở Bắc Cực",
          "Nằm ở châu Âu"
        ]
      }
    ]
  },
  {
    "id": "bi",
    "isoCode": "BI",
    "name": "Burundi",
    "officialName": "Cộng hòa Burundi",
    "nameEn": "Burundi",
    "officialNameEn": "Republic of Burundi",
    "flag": "🇧🇮",
    "capital": "Gitega",
    "capitalEn": "Gitega",
    "continent": "africa",
    "region": "Đông Phi",
    "subRegion": "Hồ Lớn châu Phi",
    "languages": [
      "fr"
    ],
    "currency": "Franc",
    "neighbors": [
      "rw",
      "tz",
      "cd"
    ],
    "geo": "landlocked",
    "landscape": "tropical",
    "flagColors": [
      "red",
      "white",
      "green"
    ],
    "altCities": [
      "Bujumbura",
      "Ngozi"
    ],
    "facts": [
      {
        "id": "bi-geography-continent",
        "category": "geography",
        "vi": "Burundi nằm ở Châu Phi.",
        "en": "Burundi is in Africa.",
        "question": "Burundi nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "bi-capital-gitega",
        "category": "capital",
        "vi": "Thủ đô của Burundi là Gitega.",
        "en": "The capital of Burundi is Gitega.",
        "question": "Thủ đô của Burundi là thành phố nào?",
        "answers": [
          "Gitega",
          "Bujumbura",
          "Ngozi",
          "Paris"
        ]
      },
      {
        "id": "bi-geography-landlocked",
        "category": "geography",
        "vi": "Burundi không giáp biển.",
        "en": "Burundi is landlocked.",
        "question": "Điều nào đúng về Burundi?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "bi-geography-lakes",
        "category": "geography",
        "vi": "Burundi nằm gần các hồ lớn của Đông Phi.",
        "en": "Burundi sits near the great lakes of East Africa.",
        "question": "Burundi nằm gần vùng nào của châu Phi?",
        "answers": [
          "Hồ Lớn Đông Phi",
          "Sa mạc Sahara",
          "Mũi Hảo Vọng",
          "Địa Trung Hải"
        ]
      }
    ]
  },
  {
    "id": "cv",
    "isoCode": "CV",
    "name": "Cabo Verde",
    "officialName": "Cộng hòa Cabo Verde",
    "nameEn": "Cabo Verde",
    "officialNameEn": "Republic of Cabo Verde",
    "flag": "🇨🇻",
    "capital": "Praia",
    "capitalEn": "Praia",
    "continent": "africa",
    "region": "Tây Phi",
    "subRegion": "Đại Tây Dương",
    "languages": [
      "pt"
    ],
    "currency": "Escudo",
    "neighbors": [],
    "geo": "island",
    "landscape": "island",
    "flagColors": [
      "blue",
      "white",
      "red"
    ],
    "altCities": [
      "Mindelo",
      "Sal"
    ],
    "facts": [
      {
        "id": "cv-geography-continent",
        "category": "geography",
        "vi": "Cabo Verde nằm ở Châu Phi.",
        "en": "Cabo Verde is in Africa.",
        "question": "Cabo Verde nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "cv-capital-praia",
        "category": "capital",
        "vi": "Thủ đô của Cabo Verde là Praia.",
        "en": "The capital of Cabo Verde is Praia.",
        "question": "Thủ đô của Cabo Verde là thành phố nào?",
        "answers": [
          "Praia",
          "Mindelo",
          "Sal",
          "Paris"
        ]
      },
      {
        "id": "cv-geography-island",
        "category": "geography",
        "vi": "Cabo Verde là một quốc gia đảo.",
        "en": "Cabo Verde is an island country.",
        "question": "Điều nào đúng về Cabo Verde?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "cv-geography-islands",
        "category": "geography",
        "vi": "Cabo Verde là quần đảo trên Đại Tây Dương, ngoài khơi Tây Phi.",
        "en": "Cabo Verde is an island group in the Atlantic off West Africa.",
        "question": "Cabo Verde nằm trên đại dương nào?",
        "answers": [
          "Đại Tây Dương",
          "Thái Bình Dương",
          "Ấn Độ Dương",
          "Bắc Băng Dương"
        ]
      }
    ]
  },
  {
    "id": "cm",
    "isoCode": "CM",
    "name": "Cameroon",
    "officialName": "Cộng hòa Cameroon",
    "nameEn": "Cameroon",
    "officialNameEn": "Republic of Cameroon",
    "flag": "🇨🇲",
    "capital": "Yaoundé",
    "capitalEn": "Yaoundé",
    "continent": "africa",
    "region": "Trung Phi",
    "subRegion": "Vịnh Guinea",
    "languages": [
      "fr",
      "en"
    ],
    "currency": "Franc CFA",
    "neighbors": [
      "ng",
      "td",
      "cf",
      "cg",
      "gq",
      "ga"
    ],
    "geo": "coastal",
    "landscape": "rainforest",
    "flagColors": [
      "green",
      "red",
      "yellow"
    ],
    "altCities": [
      "Douala",
      "Garoua",
      "Bamenda"
    ],
    "facts": [
      {
        "id": "cm-geography-continent",
        "category": "geography",
        "vi": "Cameroon nằm ở Châu Phi.",
        "en": "Cameroon is in Africa.",
        "question": "Cameroon nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "cm-capital-yaoundé",
        "category": "capital",
        "vi": "Thủ đô của Cameroon là Yaoundé.",
        "en": "The capital of Cameroon is Yaoundé.",
        "question": "Thủ đô của Cameroon là thành phố nào?",
        "answers": [
          "Yaoundé",
          "Douala",
          "Garoua",
          "Bamenda"
        ]
      },
      {
        "id": "cm-geography-coast",
        "category": "geography",
        "vi": "Cameroon giáp Vịnh Guinea.",
        "en": "Cameroon borders the Vịnh Guinea.",
        "question": "Cameroon giáp biển hoặc đại dương nào?",
        "answers": [
          "Vịnh Guinea",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "cm-geography-varied",
        "category": "geography",
        "vi": "Cameroon có biển, rừng mưa và cả núi cao.",
        "en": "Cameroon has coast, rainforest and high mountains.",
        "question": "Cameroon có kiểu thiên nhiên nào?",
        "answers": [
          "Biển, rừng mưa và núi",
          "Chỉ có sông băng",
          "Chỉ có sa mạc muối",
          "Không có rừng"
        ]
      }
    ]
  },
  {
    "id": "cf",
    "isoCode": "CF",
    "name": "Cộng hòa Trung Phi",
    "officialName": "Cộng hòa Trung Phi",
    "nameEn": "Central African Republic",
    "officialNameEn": "Central African Republic",
    "flag": "🇨🇫",
    "capital": "Bangui",
    "capitalEn": "Bangui",
    "continent": "africa",
    "region": "Trung Phi",
    "subRegion": "Lưu vực Congo",
    "languages": [
      "fr"
    ],
    "currency": "Franc CFA",
    "neighbors": [
      "td",
      "sd",
      "ss",
      "cd",
      "cg",
      "cm"
    ],
    "geo": "landlocked",
    "landscape": "rainforest",
    "flagColors": [
      "blue",
      "white",
      "green",
      "yellow"
    ],
    "altCities": [
      "Bimbo",
      "Berbérati"
    ],
    "facts": [
      {
        "id": "cf-geography-continent",
        "category": "geography",
        "vi": "Cộng hòa Trung Phi nằm ở Châu Phi.",
        "en": "Central African Republic is in Africa.",
        "question": "Cộng hòa Trung Phi nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "cf-capital-bangui",
        "category": "capital",
        "vi": "Thủ đô của Cộng hòa Trung Phi là Bangui.",
        "en": "The capital of Central African Republic is Bangui.",
        "question": "Thủ đô của Cộng hòa Trung Phi là thành phố nào?",
        "answers": [
          "Bangui",
          "Bimbo",
          "Berbérati",
          "Paris"
        ]
      },
      {
        "id": "cf-geography-landlocked",
        "category": "geography",
        "vi": "Cộng hòa Trung Phi không giáp biển.",
        "en": "Central African Republic is landlocked.",
        "question": "Điều nào đúng về Cộng hòa Trung Phi?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "cf-geography-center",
        "category": "geography",
        "vi": "Cộng hòa Trung Phi nằm ở giữa lục địa châu Phi và không giáp biển.",
        "en": "The Central African Republic is in the middle of Africa and has no coast.",
        "question": "Cộng hòa Trung Phi có đặc điểm nào?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm ở châu Âu",
          "Nằm ở Bắc Cực"
        ]
      }
    ]
  },
  {
    "id": "td",
    "isoCode": "TD",
    "name": "Chad",
    "officialName": "Cộng hòa Chad",
    "nameEn": "Chad",
    "officialNameEn": "Republic of Chad",
    "flag": "🇹🇩",
    "capital": "N'Djamena",
    "capitalEn": "N'Djamena",
    "continent": "africa",
    "region": "Trung Phi",
    "subRegion": "Sahel",
    "languages": [
      "fr",
      "ar"
    ],
    "currency": "Franc CFA",
    "neighbors": [
      "ly",
      "sd",
      "cf",
      "cm",
      "ng",
      "ne"
    ],
    "geo": "landlocked",
    "landscape": "desert",
    "flagColors": [
      "blue",
      "yellow",
      "red"
    ],
    "altCities": [
      "Moundou",
      "Sarh",
      "Abéché"
    ],
    "facts": [
      {
        "id": "td-geography-continent",
        "category": "geography",
        "vi": "Chad nằm ở Châu Phi.",
        "en": "Chad is in Africa.",
        "question": "Chad nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "td-capital-n-djamena",
        "category": "capital",
        "vi": "Thủ đô của Chad là N'Djamena.",
        "en": "The capital of Chad is N'Djamena.",
        "question": "Thủ đô của Chad là thành phố nào?",
        "answers": [
          "N'Djamena",
          "Moundou",
          "Sarh",
          "Abéché"
        ]
      },
      {
        "id": "td-geography-landlocked",
        "category": "geography",
        "vi": "Chad không giáp biển.",
        "en": "Chad is landlocked.",
        "question": "Điều nào đúng về Chad?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "td-nature-sahara",
        "category": "nature",
        "vi": "Phần bắc của Chad là sa mạc Sahara.",
        "en": "Northern Chad is part of the Sahara Desert.",
        "question": "Phần bắc Chad thuộc sa mạc nào?",
        "answers": [
          "Sahara",
          "Gobi",
          "Namib",
          "Atacama"
        ]
      }
    ]
  },
  {
    "id": "km",
    "isoCode": "KM",
    "name": "Comoros",
    "officialName": "Liên bang Comoros",
    "nameEn": "Comoros",
    "officialNameEn": "Union of the Comoros",
    "flag": "🇰🇲",
    "capital": "Moroni",
    "capitalEn": "Moroni",
    "continent": "africa",
    "region": "Đông Phi",
    "subRegion": "Ấn Độ Dương",
    "languages": [
      "ar",
      "fr"
    ],
    "currency": "Franc",
    "neighbors": [],
    "geo": "island",
    "landscape": "island",
    "flagColors": [
      "green",
      "white",
      "red",
      "yellow"
    ],
    "altCities": [
      "Mutsamudu",
      "Fomboni"
    ],
    "facts": [
      {
        "id": "km-geography-continent",
        "category": "geography",
        "vi": "Comoros nằm ở Châu Phi.",
        "en": "Comoros is in Africa.",
        "question": "Comoros nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "km-capital-moroni",
        "category": "capital",
        "vi": "Thủ đô của Comoros là Moroni.",
        "en": "The capital of Comoros is Moroni.",
        "question": "Thủ đô của Comoros là thành phố nào?",
        "answers": [
          "Moroni",
          "Mutsamudu",
          "Fomboni",
          "Paris"
        ]
      },
      {
        "id": "km-geography-island",
        "category": "geography",
        "vi": "Comoros là một quốc gia đảo.",
        "en": "Comoros is an island country.",
        "question": "Điều nào đúng về Comoros?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "km-geography-islands",
        "category": "geography",
        "vi": "Comoros là quần đảo trên Ấn Độ Dương, gần châu Phi.",
        "en": "Comoros is an island group in the Indian Ocean near Africa.",
        "question": "Comoros nằm trên đại dương nào?",
        "answers": [
          "Ấn Độ Dương",
          "Thái Bình Dương",
          "Đại Tây Dương",
          "Bắc Băng Dương"
        ]
      }
    ]
  },
  {
    "id": "cg",
    "isoCode": "CG",
    "name": "Cộng hòa Congo",
    "officialName": "Cộng hòa Congo",
    "nameEn": "Congo",
    "officialNameEn": "Republic of the Congo",
    "flag": "🇨🇬",
    "capital": "Brazzaville",
    "capitalEn": "Brazzaville",
    "continent": "africa",
    "region": "Trung Phi",
    "subRegion": "Lưu vực Congo",
    "languages": [
      "fr"
    ],
    "currency": "Franc CFA",
    "neighbors": [
      "ga",
      "cm",
      "cf",
      "cd",
      "ao"
    ],
    "geo": "coastal",
    "landscape": "rainforest",
    "flagColors": [
      "green",
      "yellow",
      "red"
    ],
    "altCities": [
      "Pointe-Noire",
      "Dolisie"
    ],
    "facts": [
      {
        "id": "cg-geography-continent",
        "category": "geography",
        "vi": "Cộng hòa Congo nằm ở Châu Phi.",
        "en": "Congo is in Africa.",
        "question": "Cộng hòa Congo nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "cg-capital-brazzaville",
        "category": "capital",
        "vi": "Thủ đô của Cộng hòa Congo là Brazzaville.",
        "en": "The capital of Congo is Brazzaville.",
        "question": "Thủ đô của Cộng hòa Congo là thành phố nào?",
        "answers": [
          "Brazzaville",
          "Pointe-Noire",
          "Dolisie",
          "Paris"
        ]
      },
      {
        "id": "cg-geography-coast",
        "category": "geography",
        "vi": "Cộng hòa Congo giáp Đại Tây Dương.",
        "en": "Congo borders the Đại Tây Dương.",
        "question": "Cộng hòa Congo giáp biển hoặc đại dương nào?",
        "answers": [
          "Đại Tây Dương",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "cg-geography-congo",
        "category": "geography",
        "vi": "Thủ đô Brazzaville nằm bên sông Congo.",
        "en": "The capital Brazzaville sits on the Congo River.",
        "question": "Thủ đô Cộng hòa Congo nằm bên con sông nào?",
        "answers": [
          "Sông Congo",
          "Sông Nile",
          "Sông Amazon",
          "Sông Danube"
        ]
      }
    ]
  },
  {
    "id": "cd",
    "isoCode": "CD",
    "name": "CHDC Congo",
    "officialName": "Cộng hòa Dân chủ Congo",
    "nameEn": "DR Congo",
    "officialNameEn": "Democratic Republic of the Congo",
    "flag": "🇨🇩",
    "capital": "Kinshasa",
    "capitalEn": "Kinshasa",
    "continent": "africa",
    "region": "Trung Phi",
    "subRegion": "Lưu vực Congo",
    "languages": [
      "fr"
    ],
    "currency": "Franc",
    "neighbors": [
      "cg",
      "cf",
      "ss",
      "ug",
      "rw",
      "bi",
      "tz",
      "zm",
      "ao"
    ],
    "geo": "coastal",
    "landscape": "rainforest",
    "flagColors": [
      "blue",
      "yellow",
      "red"
    ],
    "altCities": [
      "Lubumbashi",
      "Goma",
      "Kisangani"
    ],
    "facts": [
      {
        "id": "cd-geography-continent",
        "category": "geography",
        "vi": "CHDC Congo nằm ở Châu Phi.",
        "en": "DR Congo is in Africa.",
        "question": "CHDC Congo nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "cd-capital-kinshasa",
        "category": "capital",
        "vi": "Thủ đô của CHDC Congo là Kinshasa.",
        "en": "The capital of DR Congo is Kinshasa.",
        "question": "Thủ đô của CHDC Congo là thành phố nào?",
        "answers": [
          "Kinshasa",
          "Lubumbashi",
          "Goma",
          "Kisangani"
        ]
      },
      {
        "id": "cd-geography-coast",
        "category": "geography",
        "vi": "CHDC Congo giáp Đại Tây Dương.",
        "en": "DR Congo borders the Đại Tây Dương.",
        "question": "CHDC Congo giáp biển hoặc đại dương nào?",
        "answers": [
          "Đại Tây Dương",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "cd-geography-congo",
        "category": "geography",
        "vi": "Sông Congo chảy qua CHDC Congo và là một trong những sông lớn nhất châu Phi.",
        "en": "The Congo River runs through DR Congo and is one of Africa's greatest rivers.",
        "question": "Con sông lớn chảy qua CHDC Congo tên là gì?",
        "answers": [
          "Sông Congo",
          "Sông Nile",
          "Sông Amazon",
          "Sông Danube"
        ]
      }
    ]
  },
  {
    "id": "ci",
    "isoCode": "CI",
    "name": "Bờ Biển Ngà",
    "officialName": "Cộng hòa Côte d'Ivoire",
    "nameEn": "Côte d'Ivoire",
    "officialNameEn": "Republic of Côte d'Ivoire",
    "flag": "🇨🇮",
    "capital": "Yamoussoukro",
    "capitalEn": "Yamoussoukro",
    "continent": "africa",
    "region": "Tây Phi",
    "subRegion": "Vịnh Guinea",
    "languages": [
      "fr"
    ],
    "currency": "Franc CFA",
    "neighbors": [
      "lr",
      "gn",
      "ml",
      "bf",
      "gh"
    ],
    "geo": "coastal",
    "landscape": "tropical",
    "flagColors": [
      "orange",
      "white",
      "green"
    ],
    "altCities": [
      "Abidjan",
      "Bouaké",
      "San-Pédro"
    ],
    "facts": [
      {
        "id": "ci-geography-continent",
        "category": "geography",
        "vi": "Bờ Biển Ngà nằm ở Châu Phi.",
        "en": "Côte d'Ivoire is in Africa.",
        "question": "Bờ Biển Ngà nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "ci-capital-yamoussoukro",
        "category": "capital",
        "vi": "Thủ đô của Bờ Biển Ngà là Yamoussoukro.",
        "en": "The capital of Côte d'Ivoire is Yamoussoukro.",
        "question": "Thủ đô của Bờ Biển Ngà là thành phố nào?",
        "answers": [
          "Yamoussoukro",
          "Abidjan",
          "Bouaké",
          "San-Pédro"
        ]
      },
      {
        "id": "ci-geography-coast",
        "category": "geography",
        "vi": "Bờ Biển Ngà giáp Vịnh Guinea.",
        "en": "Côte d'Ivoire borders the Vịnh Guinea.",
        "question": "Bờ Biển Ngà giáp biển hoặc đại dương nào?",
        "answers": [
          "Vịnh Guinea",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "ci-food-cocoa",
        "category": "food",
        "vi": "Bờ Biển Ngà trồng rất nhiều ca cao.",
        "en": "Côte d'Ivoire grows a great deal of cocoa.",
        "question": "Bờ Biển Ngà nổi tiếng trồng cây gì?",
        "answers": [
          "Ca cao",
          "Lúa mì",
          "Nho",
          "Táo"
        ]
      }
    ]
  },
  {
    "id": "dj",
    "isoCode": "DJ",
    "name": "Djibouti",
    "officialName": "Cộng hòa Djibouti",
    "nameEn": "Djibouti",
    "officialNameEn": "Republic of Djibouti",
    "flag": "🇩🇯",
    "capital": "Djibouti",
    "capitalEn": "Djibouti",
    "continent": "africa",
    "region": "Đông Phi",
    "subRegion": "Sừng châu Phi",
    "languages": [
      "fr",
      "ar"
    ],
    "currency": "Franc",
    "neighbors": [
      "er",
      "et",
      "so"
    ],
    "geo": "coastal",
    "landscape": "desert",
    "flagColors": [
      "blue",
      "green",
      "white",
      "red"
    ],
    "altCities": [
      "Ali Sabieh",
      "Tadjoura"
    ],
    "facts": [
      {
        "id": "dj-geography-continent",
        "category": "geography",
        "vi": "Djibouti nằm ở Châu Phi.",
        "en": "Djibouti is in Africa.",
        "question": "Djibouti nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "dj-capital-djibouti",
        "category": "capital",
        "vi": "Thủ đô của Djibouti là Djibouti.",
        "en": "The capital of Djibouti is Djibouti.",
        "question": "Thủ đô của Djibouti là thành phố nào?",
        "answers": [
          "Djibouti",
          "Ali Sabieh",
          "Tadjoura",
          "Paris"
        ]
      },
      {
        "id": "dj-geography-coast",
        "category": "geography",
        "vi": "Djibouti giáp Vịnh Aden.",
        "en": "Djibouti borders the Vịnh Aden.",
        "question": "Djibouti giáp biển hoặc đại dương nào?",
        "answers": [
          "Vịnh Aden",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "dj-geography-horn",
        "category": "geography",
        "vi": "Djibouti nằm ở Sừng châu Phi, gần cửa Biển Đỏ.",
        "en": "Djibouti sits on the Horn of Africa near the mouth of the Red Sea.",
        "question": "Djibouti nằm ở vùng nào của châu Phi?",
        "answers": [
          "Sừng châu Phi",
          "Mũi Hảo Vọng",
          "Tây Phi đảo",
          "Bắc Cực"
        ]
      }
    ]
  },
  {
    "id": "eg",
    "isoCode": "EG",
    "name": "Ai Cập",
    "officialName": "Cộng hòa Ả Rập Ai Cập",
    "nameEn": "Egypt",
    "officialNameEn": "Arab Republic of Egypt",
    "flag": "🇪🇬",
    "capital": "Cairo",
    "capitalEn": "Cairo",
    "continent": "africa",
    "region": "Bắc Phi",
    "subRegion": "Thung lũng Nile",
    "languages": [
      "ar"
    ],
    "currency": "Bảng Ai Cập",
    "neighbors": [
      "ly",
      "sd",
      "il",
      "ps"
    ],
    "geo": "coastal",
    "landscape": "desert",
    "flagColors": [
      "red",
      "white",
      "black"
    ],
    "altCities": [
      "Alexandria",
      "Giza",
      "Luxor",
      "Aswan"
    ],
    "facts": [
      {
        "id": "eg-geography-continent",
        "category": "geography",
        "vi": "Ai Cập nằm ở Châu Phi.",
        "en": "Egypt is in Africa.",
        "question": "Ai Cập nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "eg-capital-cairo",
        "category": "capital",
        "vi": "Thủ đô của Ai Cập là Cairo.",
        "en": "The capital of Egypt is Cairo.",
        "question": "Thủ đô của Ai Cập là thành phố nào?",
        "answers": [
          "Cairo",
          "Alexandria",
          "Giza",
          "Luxor"
        ]
      },
      {
        "id": "eg-geography-coast",
        "category": "geography",
        "vi": "Ai Cập giáp Địa Trung Hải.",
        "en": "Egypt borders the Địa Trung Hải.",
        "question": "Ai Cập giáp biển hoặc đại dương nào?",
        "answers": [
          "Địa Trung Hải",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "eg-landmarks-pyramid",
        "category": "landmarks",
        "vi": "Kim tự tháp Giza đứng gần Cairo, Ai Cập.",
        "en": "The Giza pyramids stand near Cairo, Egypt.",
        "question": "Công trình đá tam giác nổi tiếng ở Ai Cập tên là gì?",
        "answers": [
          "Kim tự tháp",
          "Tháp Eiffel",
          "Colosseum",
          "Vạn Lý Trường Thành"
        ]
      },
      {
        "id": "eg-geography-nile",
        "category": "geography",
        "vi": "Sông Nile chảy qua Ai Cập ra Địa Trung Hải.",
        "en": "The Nile River flows through Egypt to the Mediterranean.",
        "question": "Con sông dài chảy qua Ai Cập tên là gì?",
        "answers": [
          "Sông Nile",
          "Sông Amazon",
          "Sông Mekong",
          "Sông Danube"
        ]
      }
    ]
  },
  {
    "id": "gq",
    "isoCode": "GQ",
    "name": "Guinea Xích Đạo",
    "officialName": "Cộng hòa Guinea Xích Đạo",
    "nameEn": "Equatorial Guinea",
    "officialNameEn": "Republic of Equatorial Guinea",
    "flag": "🇬🇶",
    "capital": "Malabo",
    "capitalEn": "Malabo",
    "continent": "africa",
    "region": "Trung Phi",
    "subRegion": "Vịnh Guinea",
    "languages": [
      "es",
      "fr"
    ],
    "currency": "Franc CFA",
    "neighbors": [
      "cm",
      "ga"
    ],
    "geo": "coastal",
    "landscape": "rainforest",
    "flagColors": [
      "green",
      "white",
      "red"
    ],
    "altCities": [
      "Bata",
      "Ebebiyín"
    ],
    "facts": [
      {
        "id": "gq-geography-continent",
        "category": "geography",
        "vi": "Guinea Xích Đạo nằm ở Châu Phi.",
        "en": "Equatorial Guinea is in Africa.",
        "question": "Guinea Xích Đạo nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "gq-capital-malabo",
        "category": "capital",
        "vi": "Thủ đô của Guinea Xích Đạo là Malabo.",
        "en": "The capital of Equatorial Guinea is Malabo.",
        "question": "Thủ đô của Guinea Xích Đạo là thành phố nào?",
        "answers": [
          "Malabo",
          "Bata",
          "Ebebiyín",
          "Paris"
        ]
      },
      {
        "id": "gq-geography-coast",
        "category": "geography",
        "vi": "Guinea Xích Đạo giáp Vịnh Guinea.",
        "en": "Equatorial Guinea borders the Vịnh Guinea.",
        "question": "Guinea Xích Đạo giáp biển hoặc đại dương nào?",
        "answers": [
          "Vịnh Guinea",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "gq-geography-island",
        "category": "geography",
        "vi": "Thủ đô Malabo của Guinea Xích Đạo nằm trên một hòn đảo.",
        "en": "Malabo, the capital of Equatorial Guinea, is on an island.",
        "question": "Thủ đô Malabo của Guinea Xích Đạo nằm ở đâu?",
        "answers": [
          "Trên một hòn đảo",
          "Giữa sa mạc Sahara",
          "Trên núi Everest",
          "Ở Bắc Cực"
        ]
      }
    ]
  },
  {
    "id": "er",
    "isoCode": "ER",
    "name": "Eritrea",
    "officialName": "Nhà nước Eritrea",
    "nameEn": "Eritrea",
    "officialNameEn": "State of Eritrea",
    "flag": "🇪🇷",
    "capital": "Asmara",
    "capitalEn": "Asmara",
    "continent": "africa",
    "region": "Đông Phi",
    "subRegion": "Sừng châu Phi",
    "languages": [
      "ti",
      "ar"
    ],
    "currency": "Nakfa",
    "neighbors": [
      "sd",
      "et",
      "dj"
    ],
    "geo": "coastal",
    "landscape": "desert",
    "flagColors": [
      "green",
      "red",
      "blue"
    ],
    "altCities": [
      "Massawa",
      "Keren"
    ],
    "facts": [
      {
        "id": "er-geography-continent",
        "category": "geography",
        "vi": "Eritrea nằm ở Châu Phi.",
        "en": "Eritrea is in Africa.",
        "question": "Eritrea nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "er-capital-asmara",
        "category": "capital",
        "vi": "Thủ đô của Eritrea là Asmara.",
        "en": "The capital of Eritrea is Asmara.",
        "question": "Thủ đô của Eritrea là thành phố nào?",
        "answers": [
          "Asmara",
          "Massawa",
          "Keren",
          "Paris"
        ]
      },
      {
        "id": "er-geography-coast",
        "category": "geography",
        "vi": "Eritrea giáp Biển Đỏ.",
        "en": "Eritrea borders the Biển Đỏ.",
        "question": "Eritrea giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Đỏ",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "er-geography-redsea",
        "category": "geography",
        "vi": "Eritrea có bờ Biển Đỏ dài.",
        "en": "Eritrea has a long Red Sea coast.",
        "question": "Eritrea giáp biển nào?",
        "answers": [
          "Biển Đỏ",
          "Biển Baltic",
          "Thái Bình Dương",
          "Biển Caribe"
        ]
      }
    ]
  },
  {
    "id": "sz",
    "isoCode": "SZ",
    "name": "Eswatini",
    "officialName": "Vương quốc Eswatini",
    "nameEn": "Eswatini",
    "officialNameEn": "Kingdom of Eswatini",
    "flag": "🇸🇿",
    "capital": "Mbabane",
    "capitalEn": "Mbabane",
    "continent": "africa",
    "region": "Nam Phi",
    "subRegion": "Nam Phi",
    "languages": [
      "en",
      "ss"
    ],
    "currency": "Lilangeni",
    "neighbors": [
      "za",
      "mz"
    ],
    "geo": "landlocked",
    "landscape": "temperate",
    "flagColors": [
      "blue",
      "yellow",
      "red"
    ],
    "altCities": [
      "Manzini",
      "Lobamba"
    ],
    "facts": [
      {
        "id": "sz-geography-continent",
        "category": "geography",
        "vi": "Eswatini nằm ở Châu Phi.",
        "en": "Eswatini is in Africa.",
        "question": "Eswatini nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "sz-capital-mbabane",
        "category": "capital",
        "vi": "Thủ đô của Eswatini là Mbabane.",
        "en": "The capital of Eswatini is Mbabane.",
        "question": "Thủ đô của Eswatini là thành phố nào?",
        "answers": [
          "Mbabane",
          "Manzini",
          "Lobamba",
          "Paris"
        ]
      },
      {
        "id": "sz-geography-landlocked",
        "category": "geography",
        "vi": "Eswatini không giáp biển.",
        "en": "Eswatini is landlocked.",
        "question": "Điều nào đúng về Eswatini?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "sz-language-en",
        "category": "language",
        "vi": "Người dân Eswatini nói tiếng Anh.",
        "en": "People in Eswatini speak tiếng Anh.",
        "question": "Người dân Eswatini nói ngôn ngữ nào?",
        "answers": [
          "tiếng Anh",
          "tiếng Việt",
          "tiếng Nhật",
          "tiếng Inuit"
        ]
      }
    ]
  },
  {
    "id": "et",
    "isoCode": "ET",
    "name": "Ethiopia",
    "officialName": "Cộng hòa Dân chủ Liên bang Ethiopia",
    "nameEn": "Ethiopia",
    "officialNameEn": "Federal Democratic Republic of Ethiopia",
    "flag": "🇪🇹",
    "capital": "Addis Ababa",
    "capitalEn": "Addis Ababa",
    "continent": "africa",
    "region": "Đông Phi",
    "subRegion": "Cao nguyên Ethiopia",
    "languages": [
      "am"
    ],
    "currency": "Birr",
    "neighbors": [
      "er",
      "dj",
      "so",
      "ke",
      "ss",
      "sd"
    ],
    "geo": "landlocked",
    "landscape": "mountain",
    "flagColors": [
      "green",
      "yellow",
      "red"
    ],
    "altCities": [
      "Dire Dawa",
      "Gondar",
      "Mekelle"
    ],
    "facts": [
      {
        "id": "et-geography-continent",
        "category": "geography",
        "vi": "Ethiopia nằm ở Châu Phi.",
        "en": "Ethiopia is in Africa.",
        "question": "Ethiopia nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "et-capital-addis-ababa",
        "category": "capital",
        "vi": "Thủ đô của Ethiopia là Addis Ababa.",
        "en": "The capital of Ethiopia is Addis Ababa.",
        "question": "Thủ đô của Ethiopia là thành phố nào?",
        "answers": [
          "Addis Ababa",
          "Dire Dawa",
          "Gondar",
          "Mekelle"
        ]
      },
      {
        "id": "et-geography-landlocked",
        "category": "geography",
        "vi": "Ethiopia không giáp biển.",
        "en": "Ethiopia is landlocked.",
        "question": "Điều nào đúng về Ethiopia?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "et-food-coffee",
        "category": "food",
        "vi": "Cà phê arabica có nguồn gốc từ cao nguyên Ethiopia.",
        "en": "Arabica coffee comes from the highlands of Ethiopia.",
        "question": "Loại đồ uống nổi tiếng có nguồn gốc từ Ethiopia là gì?",
        "answers": [
          "Cà phê",
          "Trà sữa",
          "Nước dừa",
          "Sô-cô-la nóng"
        ]
      }
    ]
  },
  {
    "id": "ga",
    "isoCode": "GA",
    "name": "Gabon",
    "officialName": "Cộng hòa Gabon",
    "nameEn": "Gabon",
    "officialNameEn": "Gabonese Republic",
    "flag": "🇬🇦",
    "capital": "Libreville",
    "capitalEn": "Libreville",
    "continent": "africa",
    "region": "Trung Phi",
    "subRegion": "Vịnh Guinea",
    "languages": [
      "fr"
    ],
    "currency": "Franc CFA",
    "neighbors": [
      "gq",
      "cm",
      "cg"
    ],
    "geo": "coastal",
    "landscape": "rainforest",
    "flagColors": [
      "green",
      "yellow",
      "blue"
    ],
    "altCities": [
      "Port-Gentil",
      "Franceville"
    ],
    "facts": [
      {
        "id": "ga-geography-continent",
        "category": "geography",
        "vi": "Gabon nằm ở Châu Phi.",
        "en": "Gabon is in Africa.",
        "question": "Gabon nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "ga-capital-libreville",
        "category": "capital",
        "vi": "Thủ đô của Gabon là Libreville.",
        "en": "The capital of Gabon is Libreville.",
        "question": "Thủ đô của Gabon là thành phố nào?",
        "answers": [
          "Libreville",
          "Port-Gentil",
          "Franceville",
          "Paris"
        ]
      },
      {
        "id": "ga-geography-coast",
        "category": "geography",
        "vi": "Gabon giáp Đại Tây Dương.",
        "en": "Gabon borders the Đại Tây Dương.",
        "question": "Gabon giáp biển hoặc đại dương nào?",
        "answers": [
          "Đại Tây Dương",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "ga-nature-rainforest",
        "category": "nature",
        "vi": "Gabon có rừng mưa dày và nhiều công viên quốc gia.",
        "en": "Gabon has thick rainforest and many national parks.",
        "question": "Gabon nổi tiếng với kiểu rừng nào?",
        "answers": [
          "Rừng mưa",
          "Rừng thông Bắc Cực",
          "Rừng xương rồng",
          "Rừng bạch dương"
        ]
      }
    ]
  },
  {
    "id": "gm",
    "isoCode": "GM",
    "name": "Gambia",
    "officialName": "Cộng hòa Gambia",
    "nameEn": "Gambia",
    "officialNameEn": "Republic of the Gambia",
    "flag": "🇬🇲",
    "capital": "Banjul",
    "capitalEn": "Banjul",
    "continent": "africa",
    "region": "Tây Phi",
    "subRegion": "Tây Phi duyên hải",
    "languages": [
      "en"
    ],
    "currency": "Dalasi",
    "neighbors": [
      "sn"
    ],
    "geo": "coastal",
    "landscape": "tropical",
    "flagColors": [
      "red",
      "blue",
      "green"
    ],
    "altCities": [
      "Serekunda",
      "Brikama"
    ],
    "facts": [
      {
        "id": "gm-geography-continent",
        "category": "geography",
        "vi": "Gambia nằm ở Châu Phi.",
        "en": "Gambia is in Africa.",
        "question": "Gambia nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "gm-capital-banjul",
        "category": "capital",
        "vi": "Thủ đô của Gambia là Banjul.",
        "en": "The capital of Gambia is Banjul.",
        "question": "Thủ đô của Gambia là thành phố nào?",
        "answers": [
          "Banjul",
          "Serekunda",
          "Brikama",
          "Paris"
        ]
      },
      {
        "id": "gm-geography-coast",
        "category": "geography",
        "vi": "Gambia giáp Đại Tây Dương.",
        "en": "Gambia borders the Đại Tây Dương.",
        "question": "Gambia giáp biển hoặc đại dương nào?",
        "answers": [
          "Đại Tây Dương",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "gm-geography-river",
        "category": "geography",
        "vi": "Gambia là quốc gia hẹp dọc theo sông Gambia.",
        "en": "The Gambia is a narrow country along the Gambia River.",
        "question": "Gambia nằm dọc theo con sông nào?",
        "answers": [
          "Sông Gambia",
          "Sông Nile",
          "Sông Amazon",
          "Sông Mekong"
        ]
      }
    ]
  },
  {
    "id": "gh",
    "isoCode": "GH",
    "name": "Ghana",
    "officialName": "Cộng hòa Ghana",
    "nameEn": "Ghana",
    "officialNameEn": "Republic of Ghana",
    "flag": "🇬🇭",
    "capital": "Accra",
    "capitalEn": "Accra",
    "continent": "africa",
    "region": "Tây Phi",
    "subRegion": "Vịnh Guinea",
    "languages": [
      "en"
    ],
    "currency": "Cedi",
    "neighbors": [
      "ci",
      "bf",
      "tg"
    ],
    "geo": "coastal",
    "landscape": "tropical",
    "flagColors": [
      "red",
      "yellow",
      "green",
      "black"
    ],
    "altCities": [
      "Kumasi",
      "Tamale",
      "Cape Coast"
    ],
    "facts": [
      {
        "id": "gh-geography-continent",
        "category": "geography",
        "vi": "Ghana nằm ở Châu Phi.",
        "en": "Ghana is in Africa.",
        "question": "Ghana nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "gh-capital-accra",
        "category": "capital",
        "vi": "Thủ đô của Ghana là Accra.",
        "en": "The capital of Ghana is Accra.",
        "question": "Thủ đô của Ghana là thành phố nào?",
        "answers": [
          "Accra",
          "Kumasi",
          "Tamale",
          "Cape Coast"
        ]
      },
      {
        "id": "gh-geography-coast",
        "category": "geography",
        "vi": "Ghana giáp Vịnh Guinea.",
        "en": "Ghana borders the Vịnh Guinea.",
        "question": "Ghana giáp biển hoặc đại dương nào?",
        "answers": [
          "Vịnh Guinea",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "gh-food-cocoa",
        "category": "food",
        "vi": "Ghana là một trong những nước trồng ca cao nhiều nhất thế giới.",
        "en": "Ghana is one of the world's biggest cocoa growers.",
        "question": "Ghana nổi tiếng trồng cây gì để làm sô-cô-la?",
        "answers": [
          "Ca cao",
          "Lúa mì",
          "Xương rồng",
          "Táo"
        ]
      }
    ]
  },
  {
    "id": "gn",
    "isoCode": "GN",
    "name": "Guinea",
    "officialName": "Cộng hòa Guinea",
    "nameEn": "Guinea",
    "officialNameEn": "Republic of Guinea",
    "flag": "🇬🇳",
    "capital": "Conakry",
    "capitalEn": "Conakry",
    "continent": "africa",
    "region": "Tây Phi",
    "subRegion": "Tây Phi duyên hải",
    "languages": [
      "fr"
    ],
    "currency": "Franc",
    "neighbors": [
      "gw",
      "sl",
      "lr",
      "ci",
      "ml",
      "sn"
    ],
    "geo": "coastal",
    "landscape": "tropical",
    "flagColors": [
      "red",
      "yellow",
      "green"
    ],
    "altCities": [
      "Nzérékoré",
      "Kankan"
    ],
    "facts": [
      {
        "id": "gn-geography-continent",
        "category": "geography",
        "vi": "Guinea nằm ở Châu Phi.",
        "en": "Guinea is in Africa.",
        "question": "Guinea nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "gn-capital-conakry",
        "category": "capital",
        "vi": "Thủ đô của Guinea là Conakry.",
        "en": "The capital of Guinea is Conakry.",
        "question": "Thủ đô của Guinea là thành phố nào?",
        "answers": [
          "Conakry",
          "Nzérékoré",
          "Kankan",
          "Paris"
        ]
      },
      {
        "id": "gn-geography-coast",
        "category": "geography",
        "vi": "Guinea giáp Đại Tây Dương.",
        "en": "Guinea borders the Đại Tây Dương.",
        "question": "Guinea giáp biển hoặc đại dương nào?",
        "answers": [
          "Đại Tây Dương",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "gn-geography-highlands",
        "category": "geography",
        "vi": "Guinea có cao nguyên và nhiều nguồn sông Tây Phi.",
        "en": "Guinea has highlands and the sources of several West African rivers.",
        "question": "Guinea nổi tiếng với dạng địa hình nào ở Tây Phi?",
        "answers": [
          "Cao nguyên và nguồn sông",
          "Sông băng",
          "Đảo san hô",
          "Sa mạc muối"
        ]
      }
    ]
  },
  {
    "id": "gw",
    "isoCode": "GW",
    "name": "Guinea-Bissau",
    "officialName": "Cộng hòa Guinea-Bissau",
    "nameEn": "Guinea-Bissau",
    "officialNameEn": "Republic of Guinea-Bissau",
    "flag": "🇬🇼",
    "capital": "Bissau",
    "capitalEn": "Bissau",
    "continent": "africa",
    "region": "Tây Phi",
    "subRegion": "Tây Phi duyên hải",
    "languages": [
      "pt"
    ],
    "currency": "Franc CFA",
    "neighbors": [
      "sn",
      "gn"
    ],
    "geo": "coastal",
    "landscape": "tropical",
    "flagColors": [
      "red",
      "yellow",
      "green"
    ],
    "altCities": [
      "Bafatá",
      "Gabú"
    ],
    "facts": [
      {
        "id": "gw-geography-continent",
        "category": "geography",
        "vi": "Guinea-Bissau nằm ở Châu Phi.",
        "en": "Guinea-Bissau is in Africa.",
        "question": "Guinea-Bissau nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "gw-capital-bissau",
        "category": "capital",
        "vi": "Thủ đô của Guinea-Bissau là Bissau.",
        "en": "The capital of Guinea-Bissau is Bissau.",
        "question": "Thủ đô của Guinea-Bissau là thành phố nào?",
        "answers": [
          "Bissau",
          "Bafatá",
          "Gabú",
          "Paris"
        ]
      },
      {
        "id": "gw-geography-coast",
        "category": "geography",
        "vi": "Guinea-Bissau giáp Đại Tây Dương.",
        "en": "Guinea-Bissau borders the Đại Tây Dương.",
        "question": "Guinea-Bissau giáp biển hoặc đại dương nào?",
        "answers": [
          "Đại Tây Dương",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "gw-language-pt",
        "category": "language",
        "vi": "Người dân Guinea-Bissau nói tiếng Bồ Đào Nha.",
        "en": "People in Guinea-Bissau speak tiếng Bồ Đào Nha.",
        "question": "Người dân Guinea-Bissau nói ngôn ngữ nào?",
        "answers": [
          "tiếng Bồ Đào Nha",
          "tiếng Việt",
          "tiếng Nhật",
          "tiếng Inuit"
        ]
      }
    ]
  },
  {
    "id": "ke",
    "isoCode": "KE",
    "name": "Kenya",
    "officialName": "Cộng hòa Kenya",
    "nameEn": "Kenya",
    "officialNameEn": "Republic of Kenya",
    "flag": "🇰🇪",
    "capital": "Nairobi",
    "capitalEn": "Nairobi",
    "continent": "africa",
    "region": "Đông Phi",
    "subRegion": "Đông Phi",
    "languages": [
      "sw",
      "en"
    ],
    "currency": "Shilling",
    "neighbors": [
      "et",
      "so",
      "ss",
      "ug",
      "tz"
    ],
    "geo": "coastal",
    "landscape": "tropical",
    "flagColors": [
      "black",
      "red",
      "green"
    ],
    "altCities": [
      "Mombasa",
      "Kisumu",
      "Nakuru"
    ],
    "facts": [
      {
        "id": "ke-geography-continent",
        "category": "geography",
        "vi": "Kenya nằm ở Châu Phi.",
        "en": "Kenya is in Africa.",
        "question": "Kenya nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "ke-capital-nairobi",
        "category": "capital",
        "vi": "Thủ đô của Kenya là Nairobi.",
        "en": "The capital of Kenya is Nairobi.",
        "question": "Thủ đô của Kenya là thành phố nào?",
        "answers": [
          "Nairobi",
          "Mombasa",
          "Kisumu",
          "Nakuru"
        ]
      },
      {
        "id": "ke-geography-coast",
        "category": "geography",
        "vi": "Kenya giáp Ấn Độ Dương.",
        "en": "Kenya borders the Ấn Độ Dương.",
        "question": "Kenya giáp biển hoặc đại dương nào?",
        "answers": [
          "Ấn Độ Dương",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "ke-animals-safari",
        "category": "animals",
        "vi": "Kenya nổi tiếng với các công viên nơi trẻ em học về sư tử, voi và hươu cao cổ.",
        "en": "Kenya is famous for parks where children can learn about lions, elephants and giraffes.",
        "question": "Kenya nổi tiếng với những con vật đồng cỏ nào?",
        "answers": [
          "Sư tử, voi và hươu cao cổ",
          "Gấu trúc",
          "Chim cánh cụt",
          "Kanguru"
        ]
      }
    ]
  },
  {
    "id": "ls",
    "isoCode": "LS",
    "name": "Lesotho",
    "officialName": "Vương quốc Lesotho",
    "nameEn": "Lesotho",
    "officialNameEn": "Kingdom of Lesotho",
    "flag": "🇱🇸",
    "capital": "Maseru",
    "capitalEn": "Maseru",
    "continent": "africa",
    "region": "Nam Phi",
    "subRegion": "Cao nguyên Drakensberg",
    "languages": [
      "st",
      "en"
    ],
    "currency": "Loti",
    "neighbors": [
      "za"
    ],
    "geo": "landlocked",
    "landscape": "mountain",
    "flagColors": [
      "blue",
      "white",
      "green"
    ],
    "altCities": [
      "Teyateyaneng",
      "Mafeteng"
    ],
    "facts": [
      {
        "id": "ls-geography-continent",
        "category": "geography",
        "vi": "Lesotho nằm ở Châu Phi.",
        "en": "Lesotho is in Africa.",
        "question": "Lesotho nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "ls-capital-maseru",
        "category": "capital",
        "vi": "Thủ đô của Lesotho là Maseru.",
        "en": "The capital of Lesotho is Maseru.",
        "question": "Thủ đô của Lesotho là thành phố nào?",
        "answers": [
          "Maseru",
          "Teyateyaneng",
          "Mafeteng",
          "Paris"
        ]
      },
      {
        "id": "ls-geography-landlocked",
        "category": "geography",
        "vi": "Lesotho không giáp biển.",
        "en": "Lesotho is landlocked.",
        "question": "Điều nào đúng về Lesotho?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "ls-geography-inside",
        "category": "geography",
        "vi": "Lesotho là quốc gia nằm trọn trong Nam Phi.",
        "en": "Lesotho is a country entirely inside South Africa.",
        "question": "Lesotho nằm trọn trong nước nào?",
        "answers": [
          "Nam Phi",
          "Kenya",
          "Ai Cập",
          "Nigeria"
        ]
      }
    ]
  },
  {
    "id": "lr",
    "isoCode": "LR",
    "name": "Liberia",
    "officialName": "Cộng hòa Liberia",
    "nameEn": "Liberia",
    "officialNameEn": "Republic of Liberia",
    "flag": "🇱🇷",
    "capital": "Monrovia",
    "capitalEn": "Monrovia",
    "continent": "africa",
    "region": "Tây Phi",
    "subRegion": "Tây Phi duyên hải",
    "languages": [
      "en"
    ],
    "currency": "Đô la Liberia",
    "neighbors": [
      "sl",
      "gn",
      "ci"
    ],
    "geo": "coastal",
    "landscape": "tropical",
    "flagColors": [
      "red",
      "white",
      "blue"
    ],
    "altCities": [
      "Gbarnga",
      "Buchanan"
    ],
    "facts": [
      {
        "id": "lr-geography-continent",
        "category": "geography",
        "vi": "Liberia nằm ở Châu Phi.",
        "en": "Liberia is in Africa.",
        "question": "Liberia nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "lr-capital-monrovia",
        "category": "capital",
        "vi": "Thủ đô của Liberia là Monrovia.",
        "en": "The capital of Liberia is Monrovia.",
        "question": "Thủ đô của Liberia là thành phố nào?",
        "answers": [
          "Monrovia",
          "Gbarnga",
          "Buchanan",
          "Paris"
        ]
      },
      {
        "id": "lr-geography-coast",
        "category": "geography",
        "vi": "Liberia giáp Đại Tây Dương.",
        "en": "Liberia borders the Đại Tây Dương.",
        "question": "Liberia giáp biển hoặc đại dương nào?",
        "answers": [
          "Đại Tây Dương",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "lr-language-en",
        "category": "language",
        "vi": "Người dân Liberia nói tiếng Anh.",
        "en": "People in Liberia speak tiếng Anh.",
        "question": "Người dân Liberia nói ngôn ngữ nào?",
        "answers": [
          "tiếng Anh",
          "tiếng Việt",
          "tiếng Nhật",
          "tiếng Inuit"
        ]
      }
    ]
  },
  {
    "id": "ly",
    "isoCode": "LY",
    "name": "Libya",
    "officialName": "Nhà nước Libya",
    "nameEn": "Libya",
    "officialNameEn": "State of Libya",
    "flag": "🇱🇾",
    "capital": "Tripoli",
    "capitalEn": "Tripoli",
    "continent": "africa",
    "region": "Bắc Phi",
    "subRegion": "Maghreb",
    "languages": [
      "ar"
    ],
    "currency": "Dinar",
    "neighbors": [
      "tn",
      "dz",
      "ne",
      "td",
      "sd",
      "eg"
    ],
    "geo": "coastal",
    "landscape": "desert",
    "flagColors": [
      "red",
      "black",
      "green"
    ],
    "altCities": [
      "Benghazi",
      "Misrata",
      "Sabha"
    ],
    "facts": [
      {
        "id": "ly-geography-continent",
        "category": "geography",
        "vi": "Libya nằm ở Châu Phi.",
        "en": "Libya is in Africa.",
        "question": "Libya nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "ly-capital-tripoli",
        "category": "capital",
        "vi": "Thủ đô của Libya là Tripoli.",
        "en": "The capital of Libya is Tripoli.",
        "question": "Thủ đô của Libya là thành phố nào?",
        "answers": [
          "Tripoli",
          "Benghazi",
          "Misrata",
          "Sabha"
        ]
      },
      {
        "id": "ly-geography-coast",
        "category": "geography",
        "vi": "Libya giáp Địa Trung Hải.",
        "en": "Libya borders the Địa Trung Hải.",
        "question": "Libya giáp biển hoặc đại dương nào?",
        "answers": [
          "Địa Trung Hải",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "ly-nature-sahara",
        "category": "nature",
        "vi": "Phần lớn Libya là sa mạc Sahara.",
        "en": "Most of Libya is the Sahara Desert.",
        "question": "Sa mạc phủ phần lớn Libya tên là gì?",
        "answers": [
          "Sahara",
          "Gobi",
          "Namib",
          "Atacama"
        ]
      }
    ]
  },
  {
    "id": "mg",
    "isoCode": "MG",
    "name": "Madagascar",
    "officialName": "Cộng hòa Madagascar",
    "nameEn": "Madagascar",
    "officialNameEn": "Republic of Madagascar",
    "flag": "🇲🇬",
    "capital": "Antananarivo",
    "capitalEn": "Antananarivo",
    "continent": "africa",
    "region": "Đông Phi",
    "subRegion": "Ấn Độ Dương",
    "languages": [
      "mg",
      "fr"
    ],
    "currency": "Ariary",
    "neighbors": [],
    "geo": "island",
    "landscape": "tropical",
    "flagColors": [
      "white",
      "red",
      "green"
    ],
    "altCities": [
      "Toamasina",
      "Antsirabe",
      "Mahajanga"
    ],
    "facts": [
      {
        "id": "mg-geography-continent",
        "category": "geography",
        "vi": "Madagascar nằm ở Châu Phi.",
        "en": "Madagascar is in Africa.",
        "question": "Madagascar nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "mg-capital-antananarivo",
        "category": "capital",
        "vi": "Thủ đô của Madagascar là Antananarivo.",
        "en": "The capital of Madagascar is Antananarivo.",
        "question": "Thủ đô của Madagascar là thành phố nào?",
        "answers": [
          "Antananarivo",
          "Toamasina",
          "Antsirabe",
          "Mahajanga"
        ]
      },
      {
        "id": "mg-geography-island",
        "category": "geography",
        "vi": "Madagascar là một quốc gia đảo.",
        "en": "Madagascar is an island country.",
        "question": "Điều nào đúng về Madagascar?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "mg-animals-lemur",
        "category": "animals",
        "vi": "Vượn cáo lemur chỉ sống tự nhiên ở Madagascar.",
        "en": "Lemurs live in the wild only in Madagascar.",
        "question": "Con vật đuôi vằn chỉ sống tự nhiên ở Madagascar là gì?",
        "answers": [
          "Vượn cáo lemur",
          "Gấu koala",
          "Gấu trúc",
          "Lạc đà"
        ]
      }
    ]
  },
  {
    "id": "mw",
    "isoCode": "MW",
    "name": "Malawi",
    "officialName": "Cộng hòa Malawi",
    "nameEn": "Malawi",
    "officialNameEn": "Republic of Malawi",
    "flag": "🇲🇼",
    "capital": "Lilongwe",
    "capitalEn": "Lilongwe",
    "continent": "africa",
    "region": "Đông Phi",
    "subRegion": "Hồ Malawi",
    "languages": [
      "en",
      "ny"
    ],
    "currency": "Kwacha",
    "neighbors": [
      "tz",
      "mz",
      "zm"
    ],
    "geo": "landlocked",
    "landscape": "tropical",
    "flagColors": [
      "black",
      "red",
      "green"
    ],
    "altCities": [
      "Blantyre",
      "Mzuzu"
    ],
    "facts": [
      {
        "id": "mw-geography-continent",
        "category": "geography",
        "vi": "Malawi nằm ở Châu Phi.",
        "en": "Malawi is in Africa.",
        "question": "Malawi nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "mw-capital-lilongwe",
        "category": "capital",
        "vi": "Thủ đô của Malawi là Lilongwe.",
        "en": "The capital of Malawi is Lilongwe.",
        "question": "Thủ đô của Malawi là thành phố nào?",
        "answers": [
          "Lilongwe",
          "Blantyre",
          "Mzuzu",
          "Paris"
        ]
      },
      {
        "id": "mw-geography-landlocked",
        "category": "geography",
        "vi": "Malawi không giáp biển.",
        "en": "Malawi is landlocked.",
        "question": "Điều nào đúng về Malawi?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "mw-nature-lake",
        "category": "nature",
        "vi": "Hồ Malawi là hồ rất dài nằm cạnh Malawi.",
        "en": "Lake Malawi is a very long lake beside Malawi.",
        "question": "Hồ dài nổi tiếng cạnh Malawi tên là gì?",
        "answers": [
          "Hồ Malawi",
          "Hồ Baikal",
          "Biển Chết",
          "Hồ Superior"
        ]
      }
    ]
  },
  {
    "id": "ml",
    "isoCode": "ML",
    "name": "Mali",
    "officialName": "Cộng hòa Mali",
    "nameEn": "Mali",
    "officialNameEn": "Republic of Mali",
    "flag": "🇲🇱",
    "capital": "Bamako",
    "capitalEn": "Bamako",
    "continent": "africa",
    "region": "Tây Phi",
    "subRegion": "Sahel",
    "languages": [
      "fr"
    ],
    "currency": "Franc CFA",
    "neighbors": [
      "dz",
      "ne",
      "bf",
      "ci",
      "gn",
      "sn",
      "mr"
    ],
    "geo": "landlocked",
    "landscape": "desert",
    "flagColors": [
      "green",
      "yellow",
      "red"
    ],
    "altCities": [
      "Timbuktu",
      "Sikasso",
      "Mopti"
    ],
    "facts": [
      {
        "id": "ml-geography-continent",
        "category": "geography",
        "vi": "Mali nằm ở Châu Phi.",
        "en": "Mali is in Africa.",
        "question": "Mali nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "ml-capital-bamako",
        "category": "capital",
        "vi": "Thủ đô của Mali là Bamako.",
        "en": "The capital of Mali is Bamako.",
        "question": "Thủ đô của Mali là thành phố nào?",
        "answers": [
          "Bamako",
          "Timbuktu",
          "Sikasso",
          "Mopti"
        ]
      },
      {
        "id": "ml-geography-landlocked",
        "category": "geography",
        "vi": "Mali không giáp biển.",
        "en": "Mali is landlocked.",
        "question": "Điều nào đúng về Mali?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "ml-landmarks-timbuktu",
        "category": "landmarks",
        "vi": "Timbuktu là thành phố cổ nổi tiếng ở Mali.",
        "en": "Timbuktu is a famous historic city in Mali.",
        "question": "Thành phố cổ nổi tiếng ở Mali tên là gì?",
        "answers": [
          "Timbuktu",
          "Cairo",
          "Paris",
          "Tokyo"
        ]
      }
    ]
  },
  {
    "id": "mr",
    "isoCode": "MR",
    "name": "Mauritania",
    "officialName": "Cộng hòa Hồi giáo Mauritania",
    "nameEn": "Mauritania",
    "officialNameEn": "Islamic Republic of Mauritania",
    "flag": "🇲🇷",
    "capital": "Nouakchott",
    "capitalEn": "Nouakchott",
    "continent": "africa",
    "region": "Tây Phi",
    "subRegion": "Sahel",
    "languages": [
      "ar"
    ],
    "currency": "Ouguiya",
    "neighbors": [
      "dz",
      "ml",
      "sn"
    ],
    "geo": "coastal",
    "landscape": "desert",
    "flagColors": [
      "green",
      "yellow",
      "red"
    ],
    "altCities": [
      "Nouadhibou",
      "Kiffa"
    ],
    "facts": [
      {
        "id": "mr-geography-continent",
        "category": "geography",
        "vi": "Mauritania nằm ở Châu Phi.",
        "en": "Mauritania is in Africa.",
        "question": "Mauritania nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "mr-capital-nouakchott",
        "category": "capital",
        "vi": "Thủ đô của Mauritania là Nouakchott.",
        "en": "The capital of Mauritania is Nouakchott.",
        "question": "Thủ đô của Mauritania là thành phố nào?",
        "answers": [
          "Nouakchott",
          "Nouadhibou",
          "Kiffa",
          "Paris"
        ]
      },
      {
        "id": "mr-geography-coast",
        "category": "geography",
        "vi": "Mauritania giáp Đại Tây Dương.",
        "en": "Mauritania borders the Đại Tây Dương.",
        "question": "Mauritania giáp biển hoặc đại dương nào?",
        "answers": [
          "Đại Tây Dương",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "mr-nature-sahara",
        "category": "nature",
        "vi": "Mauritania có nhiều sa mạc Sahara trải ra Đại Tây Dương.",
        "en": "Mauritania has a lot of Sahara desert reaching the Atlantic.",
        "question": "Sa mạc lớn ở Mauritania tên là gì?",
        "answers": [
          "Sahara",
          "Gobi",
          "Namib",
          "Atacama"
        ]
      }
    ]
  },
  {
    "id": "mu",
    "isoCode": "MU",
    "name": "Mauritius",
    "officialName": "Cộng hòa Mauritius",
    "nameEn": "Mauritius",
    "officialNameEn": "Republic of Mauritius",
    "flag": "🇲🇺",
    "capital": "Port Louis",
    "capitalEn": "Port Louis",
    "continent": "africa",
    "region": "Đông Phi",
    "subRegion": "Ấn Độ Dương",
    "languages": [
      "en",
      "fr"
    ],
    "currency": "Rupee",
    "neighbors": [],
    "geo": "island",
    "landscape": "island",
    "flagColors": [
      "red",
      "blue",
      "yellow",
      "green"
    ],
    "altCities": [
      "Curepipe",
      "Quatre Bornes"
    ],
    "facts": [
      {
        "id": "mu-geography-continent",
        "category": "geography",
        "vi": "Mauritius nằm ở Châu Phi.",
        "en": "Mauritius is in Africa.",
        "question": "Mauritius nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "mu-capital-port-louis",
        "category": "capital",
        "vi": "Thủ đô của Mauritius là Port Louis.",
        "en": "The capital of Mauritius is Port Louis.",
        "question": "Thủ đô của Mauritius là thành phố nào?",
        "answers": [
          "Port Louis",
          "Curepipe",
          "Quatre Bornes",
          "Paris"
        ]
      },
      {
        "id": "mu-geography-island",
        "category": "geography",
        "vi": "Mauritius là một quốc gia đảo.",
        "en": "Mauritius is an island country.",
        "question": "Điều nào đúng về Mauritius?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "mu-animals-dodo",
        "category": "animals",
        "vi": "Chim dodo từng sống ở đảo Mauritius.",
        "en": "The dodo bird once lived on the island of Mauritius.",
        "question": "Loài chim không biết bay từng sống ở Mauritius tên là gì?",
        "answers": [
          "Dodo",
          "Chim cánh cụt",
          "Đại bàng",
          "Vẹt"
        ]
      }
    ]
  },
  {
    "id": "ma",
    "isoCode": "MA",
    "name": "Morocco",
    "officialName": "Vương quốc Morocco",
    "nameEn": "Morocco",
    "officialNameEn": "Kingdom of Morocco",
    "flag": "🇲🇦",
    "capital": "Rabat",
    "capitalEn": "Rabat",
    "continent": "africa",
    "region": "Bắc Phi",
    "subRegion": "Maghreb",
    "languages": [
      "ar"
    ],
    "currency": "Dirham",
    "neighbors": [
      "dz"
    ],
    "geo": "coastal",
    "landscape": "desert",
    "flagColors": [
      "red",
      "green"
    ],
    "altCities": [
      "Casablanca",
      "Marrakesh",
      "Fes",
      "Tangier"
    ],
    "facts": [
      {
        "id": "ma-geography-continent",
        "category": "geography",
        "vi": "Morocco nằm ở Châu Phi.",
        "en": "Morocco is in Africa.",
        "question": "Morocco nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "ma-capital-rabat",
        "category": "capital",
        "vi": "Thủ đô của Morocco là Rabat.",
        "en": "The capital of Morocco is Rabat.",
        "question": "Thủ đô của Morocco là thành phố nào?",
        "answers": [
          "Rabat",
          "Casablanca",
          "Marrakesh",
          "Fes"
        ]
      },
      {
        "id": "ma-geography-coast",
        "category": "geography",
        "vi": "Morocco giáp Địa Trung Hải.",
        "en": "Morocco borders the Địa Trung Hải.",
        "question": "Morocco giáp biển hoặc đại dương nào?",
        "answers": [
          "Địa Trung Hải",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "ma-nature-atlas",
        "category": "nature",
        "vi": "Dãy Atlas chạy qua Morocco.",
        "en": "The Atlas Mountains run through Morocco.",
        "question": "Dãy núi lớn ở Morocco tên là gì?",
        "answers": [
          "Atlas",
          "Alps",
          "Andes",
          "Himalaya"
        ]
      }
    ]
  },
  {
    "id": "mz",
    "isoCode": "MZ",
    "name": "Mozambique",
    "officialName": "Cộng hòa Mozambique",
    "nameEn": "Mozambique",
    "officialNameEn": "Republic of Mozambique",
    "flag": "🇲🇿",
    "capital": "Maputo",
    "capitalEn": "Maputo",
    "continent": "africa",
    "region": "Đông Phi",
    "subRegion": "Ấn Độ Dương",
    "languages": [
      "pt"
    ],
    "currency": "Metical",
    "neighbors": [
      "tz",
      "mw",
      "zm",
      "zw",
      "za",
      "sz"
    ],
    "geo": "coastal",
    "landscape": "tropical",
    "flagColors": [
      "green",
      "black",
      "yellow",
      "red"
    ],
    "altCities": [
      "Beira",
      "Nampula",
      "Pemba"
    ],
    "facts": [
      {
        "id": "mz-geography-continent",
        "category": "geography",
        "vi": "Mozambique nằm ở Châu Phi.",
        "en": "Mozambique is in Africa.",
        "question": "Mozambique nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "mz-capital-maputo",
        "category": "capital",
        "vi": "Thủ đô của Mozambique là Maputo.",
        "en": "The capital of Mozambique is Maputo.",
        "question": "Thủ đô của Mozambique là thành phố nào?",
        "answers": [
          "Maputo",
          "Beira",
          "Nampula",
          "Pemba"
        ]
      },
      {
        "id": "mz-geography-coast",
        "category": "geography",
        "vi": "Mozambique giáp Ấn Độ Dương.",
        "en": "Mozambique borders the Ấn Độ Dương.",
        "question": "Mozambique giáp biển hoặc đại dương nào?",
        "answers": [
          "Ấn Độ Dương",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "mz-geography-indian",
        "category": "geography",
        "vi": "Mozambique nằm trên bờ Ấn Độ Dương.",
        "en": "Mozambique sits on the Indian Ocean.",
        "question": "Mozambique giáp đại dương nào?",
        "answers": [
          "Ấn Độ Dương",
          "Thái Bình Dương",
          "Đại Tây Dương",
          "Bắc Băng Dương"
        ]
      }
    ]
  },
  {
    "id": "na",
    "isoCode": "NA",
    "name": "Namibia",
    "officialName": "Cộng hòa Namibia",
    "nameEn": "Namibia",
    "officialNameEn": "Republic of Namibia",
    "flag": "🇳🇦",
    "capital": "Windhoek",
    "capitalEn": "Windhoek",
    "continent": "africa",
    "region": "Nam Phi",
    "subRegion": "Namib",
    "languages": [
      "en"
    ],
    "currency": "Đô la Namibia",
    "neighbors": [
      "ao",
      "zm",
      "bw",
      "za"
    ],
    "geo": "coastal",
    "landscape": "desert",
    "flagColors": [
      "blue",
      "red",
      "green"
    ],
    "altCities": [
      "Swakopmund",
      "Walvis Bay",
      "Oshakati"
    ],
    "facts": [
      {
        "id": "na-geography-continent",
        "category": "geography",
        "vi": "Namibia nằm ở Châu Phi.",
        "en": "Namibia is in Africa.",
        "question": "Namibia nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "na-capital-windhoek",
        "category": "capital",
        "vi": "Thủ đô của Namibia là Windhoek.",
        "en": "The capital of Namibia is Windhoek.",
        "question": "Thủ đô của Namibia là thành phố nào?",
        "answers": [
          "Windhoek",
          "Swakopmund",
          "Walvis Bay",
          "Oshakati"
        ]
      },
      {
        "id": "na-geography-coast",
        "category": "geography",
        "vi": "Namibia giáp Đại Tây Dương.",
        "en": "Namibia borders the Đại Tây Dương.",
        "question": "Namibia giáp biển hoặc đại dương nào?",
        "answers": [
          "Đại Tây Dương",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "na-nature-namib",
        "category": "nature",
        "vi": "Sa mạc Namib nằm dọc bờ biển Namibia.",
        "en": "The Namib Desert runs along the coast of Namibia.",
        "question": "Sa mạc dọc bờ biển Namibia tên là gì?",
        "answers": [
          "Sa mạc Namib",
          "Sa mạc Gobi",
          "Sa mạc Sahara",
          "Sa mạc Atacama"
        ]
      }
    ]
  },
  {
    "id": "ne",
    "isoCode": "NE",
    "name": "Niger",
    "officialName": "Cộng hòa Niger",
    "nameEn": "Niger",
    "officialNameEn": "Republic of the Niger",
    "flag": "🇳🇪",
    "capital": "Niamey",
    "capitalEn": "Niamey",
    "continent": "africa",
    "region": "Tây Phi",
    "subRegion": "Sahel",
    "languages": [
      "fr"
    ],
    "currency": "Franc CFA",
    "neighbors": [
      "dz",
      "ly",
      "td",
      "ng",
      "bj",
      "bf",
      "ml"
    ],
    "geo": "landlocked",
    "landscape": "desert",
    "flagColors": [
      "orange",
      "white",
      "green"
    ],
    "altCities": [
      "Zinder",
      "Maradi",
      "Agadez"
    ],
    "facts": [
      {
        "id": "ne-geography-continent",
        "category": "geography",
        "vi": "Niger nằm ở Châu Phi.",
        "en": "Niger is in Africa.",
        "question": "Niger nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "ne-capital-niamey",
        "category": "capital",
        "vi": "Thủ đô của Niger là Niamey.",
        "en": "The capital of Niger is Niamey.",
        "question": "Thủ đô của Niger là thành phố nào?",
        "answers": [
          "Niamey",
          "Zinder",
          "Maradi",
          "Agadez"
        ]
      },
      {
        "id": "ne-geography-landlocked",
        "category": "geography",
        "vi": "Niger không giáp biển.",
        "en": "Niger is landlocked.",
        "question": "Điều nào đúng về Niger?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "ne-nature-sahara",
        "category": "nature",
        "vi": "Phần lớn Niger là sa mạc Sahara.",
        "en": "Most of Niger is the Sahara Desert.",
        "question": "Sa mạc phủ phần lớn Niger tên là gì?",
        "answers": [
          "Sahara",
          "Gobi",
          "Namib",
          "Atacama"
        ]
      }
    ]
  },
  {
    "id": "ng",
    "isoCode": "NG",
    "name": "Nigeria",
    "officialName": "Cộng hòa Liên bang Nigeria",
    "nameEn": "Nigeria",
    "officialNameEn": "Federal Republic of Nigeria",
    "flag": "🇳🇬",
    "capital": "Abuja",
    "capitalEn": "Abuja",
    "continent": "africa",
    "region": "Tây Phi",
    "subRegion": "Vịnh Guinea",
    "languages": [
      "en"
    ],
    "currency": "Naira",
    "neighbors": [
      "bj",
      "ne",
      "td",
      "cm"
    ],
    "geo": "coastal",
    "landscape": "tropical",
    "flagColors": [
      "green",
      "white"
    ],
    "altCities": [
      "Lagos",
      "Kano",
      "Ibadan",
      "Port Harcourt"
    ],
    "facts": [
      {
        "id": "ng-geography-continent",
        "category": "geography",
        "vi": "Nigeria nằm ở Châu Phi.",
        "en": "Nigeria is in Africa.",
        "question": "Nigeria nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "ng-capital-abuja",
        "category": "capital",
        "vi": "Thủ đô của Nigeria là Abuja.",
        "en": "The capital of Nigeria is Abuja.",
        "question": "Thủ đô của Nigeria là thành phố nào?",
        "answers": [
          "Abuja",
          "Lagos",
          "Kano",
          "Ibadan"
        ]
      },
      {
        "id": "ng-geography-coast",
        "category": "geography",
        "vi": "Nigeria giáp Vịnh Guinea.",
        "en": "Nigeria borders the Vịnh Guinea.",
        "question": "Nigeria giáp biển hoặc đại dương nào?",
        "answers": [
          "Vịnh Guinea",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "ng-geography-populous",
        "category": "geography",
        "vi": "Nigeria là quốc gia có nhiều người nhất ở châu Phi.",
        "en": "Nigeria is the most populous country in Africa.",
        "question": "Quốc gia có nhiều người nhất châu Phi là nước nào?",
        "answers": [
          "Nigeria",
          "Ai Cập",
          "Nam Phi",
          "Kenya"
        ]
      }
    ]
  },
  {
    "id": "rw",
    "isoCode": "RW",
    "name": "Rwanda",
    "officialName": "Cộng hòa Rwanda",
    "nameEn": "Rwanda",
    "officialNameEn": "Republic of Rwanda",
    "flag": "🇷🇼",
    "capital": "Kigali",
    "capitalEn": "Kigali",
    "continent": "africa",
    "region": "Đông Phi",
    "subRegion": "Hồ Lớn châu Phi",
    "languages": [
      "rw",
      "en",
      "fr"
    ],
    "currency": "Franc",
    "neighbors": [
      "ug",
      "tz",
      "bi",
      "cd"
    ],
    "geo": "landlocked",
    "landscape": "mountain",
    "flagColors": [
      "blue",
      "yellow",
      "green"
    ],
    "altCities": [
      "Butare",
      "Gisenyi",
      "Musanze"
    ],
    "facts": [
      {
        "id": "rw-geography-continent",
        "category": "geography",
        "vi": "Rwanda nằm ở Châu Phi.",
        "en": "Rwanda is in Africa.",
        "question": "Rwanda nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "rw-capital-kigali",
        "category": "capital",
        "vi": "Thủ đô của Rwanda là Kigali.",
        "en": "The capital of Rwanda is Kigali.",
        "question": "Thủ đô của Rwanda là thành phố nào?",
        "answers": [
          "Kigali",
          "Butare",
          "Gisenyi",
          "Musanze"
        ]
      },
      {
        "id": "rw-geography-landlocked",
        "category": "geography",
        "vi": "Rwanda không giáp biển.",
        "en": "Rwanda is landlocked.",
        "question": "Điều nào đúng về Rwanda?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "rw-animals-gorilla",
        "category": "animals",
        "vi": "Khỉ gorilla núi sống ở rừng Rwanda.",
        "en": "Mountain gorillas live in the forests of Rwanda.",
        "question": "Loài khỉ lớn sống ở rừng Rwanda là gì?",
        "answers": [
          "Gorilla núi",
          "Gấu trúc",
          "Kanguru",
          "Lạc đà"
        ]
      }
    ]
  },
  {
    "id": "st",
    "isoCode": "ST",
    "name": "São Tomé và Príncipe",
    "officialName": "Cộng hòa Dân chủ São Tomé và Príncipe",
    "nameEn": "Sao Tome and Principe",
    "officialNameEn": "Democratic Republic of Sao Tome and Principe",
    "flag": "🇸🇹",
    "capital": "São Tomé",
    "capitalEn": "Sao Tome",
    "continent": "africa",
    "region": "Trung Phi",
    "subRegion": "Vịnh Guinea",
    "languages": [
      "pt"
    ],
    "currency": "Dobra",
    "neighbors": [],
    "geo": "island",
    "landscape": "island",
    "flagColors": [
      "green",
      "yellow",
      "red"
    ],
    "altCities": [
      "Santo António",
      "Neves"
    ],
    "facts": [
      {
        "id": "st-geography-continent",
        "category": "geography",
        "vi": "São Tomé và Príncipe nằm ở Châu Phi.",
        "en": "Sao Tome and Principe is in Africa.",
        "question": "São Tomé và Príncipe nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "st-capital-sao-tome",
        "category": "capital",
        "vi": "Thủ đô của São Tomé và Príncipe là São Tomé.",
        "en": "The capital of Sao Tome and Principe is Sao Tome.",
        "question": "Thủ đô của São Tomé và Príncipe là thành phố nào?",
        "answers": [
          "São Tomé",
          "Santo António",
          "Neves",
          "Paris"
        ]
      },
      {
        "id": "st-geography-island",
        "category": "geography",
        "vi": "São Tomé và Príncipe là một quốc gia đảo.",
        "en": "Sao Tome and Principe is an island country.",
        "question": "Điều nào đúng về São Tomé và Príncipe?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "st-geography-islands",
        "category": "geography",
        "vi": "São Tomé và Príncipe là hai đảo trên Vịnh Guinea.",
        "en": "Sao Tome and Principe is two islands in the Gulf of Guinea.",
        "question": "São Tomé và Príncipe nằm ở vịnh nào?",
        "answers": [
          "Vịnh Guinea",
          "Vịnh Bengal",
          "Vịnh Mexico",
          "Vịnh Ba Tư"
        ]
      }
    ]
  },
  {
    "id": "sn",
    "isoCode": "SN",
    "name": "Senegal",
    "officialName": "Cộng hòa Senegal",
    "nameEn": "Senegal",
    "officialNameEn": "Republic of Senegal",
    "flag": "🇸🇳",
    "capital": "Dakar",
    "capitalEn": "Dakar",
    "continent": "africa",
    "region": "Tây Phi",
    "subRegion": "Tây Phi duyên hải",
    "languages": [
      "fr"
    ],
    "currency": "Franc CFA",
    "neighbors": [
      "mr",
      "ml",
      "gn",
      "gw",
      "gm"
    ],
    "geo": "coastal",
    "landscape": "tropical",
    "flagColors": [
      "green",
      "yellow",
      "red"
    ],
    "altCities": [
      "Saint-Louis",
      "Thiès",
      "Ziguinchor"
    ],
    "facts": [
      {
        "id": "sn-geography-continent",
        "category": "geography",
        "vi": "Senegal nằm ở Châu Phi.",
        "en": "Senegal is in Africa.",
        "question": "Senegal nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "sn-capital-dakar",
        "category": "capital",
        "vi": "Thủ đô của Senegal là Dakar.",
        "en": "The capital of Senegal is Dakar.",
        "question": "Thủ đô của Senegal là thành phố nào?",
        "answers": [
          "Dakar",
          "Saint-Louis",
          "Thiès",
          "Ziguinchor"
        ]
      },
      {
        "id": "sn-geography-coast",
        "category": "geography",
        "vi": "Senegal giáp Đại Tây Dương.",
        "en": "Senegal borders the Đại Tây Dương.",
        "question": "Senegal giáp biển hoặc đại dương nào?",
        "answers": [
          "Đại Tây Dương",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "sn-geography-dakar",
        "category": "geography",
        "vi": "Dakar là thành phố ở cực tây lục địa châu Phi.",
        "en": "Dakar is a city on the western edge of mainland Africa.",
        "question": "Thủ đô Senegal nằm ở phía nào của lục địa châu Phi?",
        "answers": [
          "Phía tây",
          "Phía đông",
          "Phía bắc cực",
          "Phía nam cực"
        ]
      }
    ]
  },
  {
    "id": "sc",
    "isoCode": "SC",
    "name": "Seychelles",
    "officialName": "Cộng hòa Seychelles",
    "nameEn": "Seychelles",
    "officialNameEn": "Republic of Seychelles",
    "flag": "🇸🇨",
    "capital": "Victoria",
    "capitalEn": "Victoria",
    "continent": "africa",
    "region": "Đông Phi",
    "subRegion": "Ấn Độ Dương",
    "languages": [
      "en",
      "fr"
    ],
    "currency": "Rupee",
    "neighbors": [],
    "geo": "island",
    "landscape": "island",
    "flagColors": [
      "blue",
      "yellow",
      "red",
      "white",
      "green"
    ],
    "altCities": [
      "Anse Boileau",
      "Beau Vallon"
    ],
    "facts": [
      {
        "id": "sc-geography-continent",
        "category": "geography",
        "vi": "Seychelles nằm ở Châu Phi.",
        "en": "Seychelles is in Africa.",
        "question": "Seychelles nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "sc-capital-victoria",
        "category": "capital",
        "vi": "Thủ đô của Seychelles là Victoria.",
        "en": "The capital of Seychelles is Victoria.",
        "question": "Thủ đô của Seychelles là thành phố nào?",
        "answers": [
          "Victoria",
          "Anse Boileau",
          "Beau Vallon",
          "Paris"
        ]
      },
      {
        "id": "sc-geography-island",
        "category": "geography",
        "vi": "Seychelles là một quốc gia đảo.",
        "en": "Seychelles is an island country.",
        "question": "Điều nào đúng về Seychelles?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "sc-nature-beach",
        "category": "nature",
        "vi": "Seychelles có bãi biển cát trắng và đá granit lớn.",
        "en": "Seychelles has white sand beaches and large granite rocks.",
        "question": "Seychelles nổi tiếng với cảnh gì?",
        "answers": [
          "Bãi biển cát trắng",
          "Sa mạc cát đỏ",
          "Sông băng",
          "Rừng thông Bắc Cực"
        ]
      }
    ]
  },
  {
    "id": "sl",
    "isoCode": "SL",
    "name": "Sierra Leone",
    "officialName": "Cộng hòa Sierra Leone",
    "nameEn": "Sierra Leone",
    "officialNameEn": "Republic of Sierra Leone",
    "flag": "🇸🇱",
    "capital": "Freetown",
    "capitalEn": "Freetown",
    "continent": "africa",
    "region": "Tây Phi",
    "subRegion": "Tây Phi duyên hải",
    "languages": [
      "en"
    ],
    "currency": "Leone",
    "neighbors": [
      "gn",
      "lr"
    ],
    "geo": "coastal",
    "landscape": "tropical",
    "flagColors": [
      "green",
      "white",
      "blue"
    ],
    "altCities": [
      "Bo",
      "Kenema"
    ],
    "facts": [
      {
        "id": "sl-geography-continent",
        "category": "geography",
        "vi": "Sierra Leone nằm ở Châu Phi.",
        "en": "Sierra Leone is in Africa.",
        "question": "Sierra Leone nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "sl-capital-freetown",
        "category": "capital",
        "vi": "Thủ đô của Sierra Leone là Freetown.",
        "en": "The capital of Sierra Leone is Freetown.",
        "question": "Thủ đô của Sierra Leone là thành phố nào?",
        "answers": [
          "Freetown",
          "Bo",
          "Kenema",
          "Paris"
        ]
      },
      {
        "id": "sl-geography-coast",
        "category": "geography",
        "vi": "Sierra Leone giáp Đại Tây Dương.",
        "en": "Sierra Leone borders the Đại Tây Dương.",
        "question": "Sierra Leone giáp biển hoặc đại dương nào?",
        "answers": [
          "Đại Tây Dương",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "sl-language-en",
        "category": "language",
        "vi": "Người dân Sierra Leone nói tiếng Anh.",
        "en": "People in Sierra Leone speak tiếng Anh.",
        "question": "Người dân Sierra Leone nói ngôn ngữ nào?",
        "answers": [
          "tiếng Anh",
          "tiếng Việt",
          "tiếng Nhật",
          "tiếng Inuit"
        ]
      }
    ]
  },
  {
    "id": "so",
    "isoCode": "SO",
    "name": "Somalia",
    "officialName": "Cộng hòa Liên bang Somalia",
    "nameEn": "Somalia",
    "officialNameEn": "Federal Republic of Somalia",
    "flag": "🇸🇴",
    "capital": "Mogadishu",
    "capitalEn": "Mogadishu",
    "continent": "africa",
    "region": "Đông Phi",
    "subRegion": "Sừng châu Phi",
    "languages": [
      "so",
      "ar"
    ],
    "currency": "Shilling",
    "neighbors": [
      "dj",
      "et",
      "ke"
    ],
    "geo": "coastal",
    "landscape": "desert",
    "flagColors": [
      "blue",
      "white"
    ],
    "altCities": [
      "Hargeisa",
      "Kismayo",
      "Bosaso"
    ],
    "facts": [
      {
        "id": "so-geography-continent",
        "category": "geography",
        "vi": "Somalia nằm ở Châu Phi.",
        "en": "Somalia is in Africa.",
        "question": "Somalia nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "so-capital-mogadishu",
        "category": "capital",
        "vi": "Thủ đô của Somalia là Mogadishu.",
        "en": "The capital of Somalia is Mogadishu.",
        "question": "Thủ đô của Somalia là thành phố nào?",
        "answers": [
          "Mogadishu",
          "Hargeisa",
          "Kismayo",
          "Bosaso"
        ]
      },
      {
        "id": "so-geography-coast",
        "category": "geography",
        "vi": "Somalia giáp Ấn Độ Dương.",
        "en": "Somalia borders the Ấn Độ Dương.",
        "question": "Somalia giáp biển hoặc đại dương nào?",
        "answers": [
          "Ấn Độ Dương",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "so-geography-horn",
        "category": "geography",
        "vi": "Somalia nằm trên Sừng châu Phi và có bờ biển rất dài.",
        "en": "Somalia sits on the Horn of Africa and has a very long coast.",
        "question": "Somalia nằm ở vùng nào của châu Phi?",
        "answers": [
          "Sừng châu Phi",
          "Tây Phi đảo",
          "Bắc Cực",
          "Andes"
        ]
      }
    ]
  },
  {
    "id": "za",
    "isoCode": "ZA",
    "name": "Nam Phi",
    "officialName": "Cộng hòa Nam Phi",
    "nameEn": "South Africa",
    "officialNameEn": "Republic of South Africa",
    "flag": "🇿🇦",
    "capital": "Pretoria",
    "capitalEn": "Pretoria",
    "continent": "africa",
    "region": "Nam Phi",
    "subRegion": "Mũi châu Phi",
    "languages": [
      "en",
      "zu",
      "af"
    ],
    "currency": "Rand",
    "neighbors": [
      "na",
      "bw",
      "zw",
      "mz",
      "sz",
      "ls"
    ],
    "geo": "coastal",
    "landscape": "temperate",
    "flagColors": [
      "red",
      "blue",
      "green",
      "yellow",
      "black"
    ],
    "altCities": [
      "Cape Town",
      "Johannesburg",
      "Durban"
    ],
    "facts": [
      {
        "id": "za-geography-continent",
        "category": "geography",
        "vi": "Nam Phi nằm ở Châu Phi.",
        "en": "South Africa is in Africa.",
        "question": "Nam Phi nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "za-capital-pretoria",
        "category": "capital",
        "vi": "Thủ đô của Nam Phi là Pretoria.",
        "en": "The capital of South Africa is Pretoria.",
        "question": "Thủ đô của Nam Phi là thành phố nào?",
        "answers": [
          "Pretoria",
          "Cape Town",
          "Johannesburg",
          "Durban"
        ]
      },
      {
        "id": "za-geography-coast",
        "category": "geography",
        "vi": "Nam Phi giáp Ấn Độ Dương.",
        "en": "South Africa borders the Ấn Độ Dương.",
        "question": "Nam Phi giáp biển hoặc đại dương nào?",
        "answers": [
          "Ấn Độ Dương",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "za-nature-table",
        "category": "nature",
        "vi": "Núi Bàn (Table Mountain) nhìn ra thành phố Cape Town.",
        "en": "Table Mountain looks over the city of Cape Town.",
        "question": "Ngọn núi phẳng nổi tiếng ở Nam Phi tên là gì?",
        "answers": [
          "Núi Bàn",
          "Núi Phú Sĩ",
          "Núi Everest",
          "Núi Kilimanjaro"
        ]
      }
    ]
  },
  {
    "id": "ss",
    "isoCode": "SS",
    "name": "Nam Sudan",
    "officialName": "Cộng hòa Nam Sudan",
    "nameEn": "South Sudan",
    "officialNameEn": "Republic of South Sudan",
    "flag": "🇸🇸",
    "capital": "Juba",
    "capitalEn": "Juba",
    "continent": "africa",
    "region": "Đông Phi",
    "subRegion": "Thung lũng Nile",
    "languages": [
      "en"
    ],
    "currency": "Bảng",
    "neighbors": [
      "sd",
      "et",
      "ke",
      "ug",
      "cd",
      "cf"
    ],
    "geo": "landlocked",
    "landscape": "tropical",
    "flagColors": [
      "black",
      "red",
      "green"
    ],
    "altCities": [
      "Malakal",
      "Wau"
    ],
    "facts": [
      {
        "id": "ss-geography-continent",
        "category": "geography",
        "vi": "Nam Sudan nằm ở Châu Phi.",
        "en": "South Sudan is in Africa.",
        "question": "Nam Sudan nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "ss-capital-juba",
        "category": "capital",
        "vi": "Thủ đô của Nam Sudan là Juba.",
        "en": "The capital of South Sudan is Juba.",
        "question": "Thủ đô của Nam Sudan là thành phố nào?",
        "answers": [
          "Juba",
          "Malakal",
          "Wau",
          "Paris"
        ]
      },
      {
        "id": "ss-geography-landlocked",
        "category": "geography",
        "vi": "Nam Sudan không giáp biển.",
        "en": "South Sudan is landlocked.",
        "question": "Điều nào đúng về Nam Sudan?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "ss-geography-nile",
        "category": "geography",
        "vi": "Sông Nile Trắng chảy qua Nam Sudan.",
        "en": "The White Nile flows through South Sudan.",
        "question": "Con sông lớn chảy qua Nam Sudan tên là gì?",
        "answers": [
          "Sông Nile Trắng",
          "Sông Amazon",
          "Sông Danube",
          "Sông Mekong"
        ]
      }
    ]
  },
  {
    "id": "sd",
    "isoCode": "SD",
    "name": "Sudan",
    "officialName": "Cộng hòa Sudan",
    "nameEn": "Sudan",
    "officialNameEn": "Republic of the Sudan",
    "flag": "🇸🇩",
    "capital": "Khartoum",
    "capitalEn": "Khartoum",
    "continent": "africa",
    "region": "Bắc Phi",
    "subRegion": "Thung lũng Nile",
    "languages": [
      "ar"
    ],
    "currency": "Bảng",
    "neighbors": [
      "eg",
      "ly",
      "td",
      "cf",
      "ss",
      "et",
      "er"
    ],
    "geo": "coastal",
    "landscape": "desert",
    "flagColors": [
      "red",
      "white",
      "black"
    ],
    "altCities": [
      "Omdurman",
      "Port Sudan",
      "Kassala"
    ],
    "facts": [
      {
        "id": "sd-geography-continent",
        "category": "geography",
        "vi": "Sudan nằm ở Châu Phi.",
        "en": "Sudan is in Africa.",
        "question": "Sudan nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "sd-capital-khartoum",
        "category": "capital",
        "vi": "Thủ đô của Sudan là Khartoum.",
        "en": "The capital of Sudan is Khartoum.",
        "question": "Thủ đô của Sudan là thành phố nào?",
        "answers": [
          "Khartoum",
          "Omdurman",
          "Port Sudan",
          "Kassala"
        ]
      },
      {
        "id": "sd-geography-coast",
        "category": "geography",
        "vi": "Sudan giáp Biển Đỏ.",
        "en": "Sudan borders the Biển Đỏ.",
        "question": "Sudan giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Đỏ",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "sd-geography-nile",
        "category": "geography",
        "vi": "Sông Nile chảy qua Sudan rồi vào Ai Cập.",
        "en": "The Nile River flows through Sudan and then into Egypt.",
        "question": "Con sông lớn chảy qua Sudan tên là gì?",
        "answers": [
          "Sông Nile",
          "Sông Amazon",
          "Sông Mekong",
          "Sông Danube"
        ]
      }
    ]
  },
  {
    "id": "tz",
    "isoCode": "TZ",
    "name": "Tanzania",
    "officialName": "Cộng hòa Thống nhất Tanzania",
    "nameEn": "Tanzania",
    "officialNameEn": "United Republic of Tanzania",
    "flag": "🇹🇿",
    "capital": "Dodoma",
    "capitalEn": "Dodoma",
    "continent": "africa",
    "region": "Đông Phi",
    "subRegion": "Đông Phi",
    "languages": [
      "sw",
      "en"
    ],
    "currency": "Shilling",
    "neighbors": [
      "ke",
      "ug",
      "rw",
      "bi",
      "cd",
      "zm",
      "mw",
      "mz"
    ],
    "geo": "coastal",
    "landscape": "tropical",
    "flagColors": [
      "green",
      "yellow",
      "black",
      "blue"
    ],
    "altCities": [
      "Dar es Salaam",
      "Arusha",
      "Zanzibar",
      "Mwanza"
    ],
    "facts": [
      {
        "id": "tz-geography-continent",
        "category": "geography",
        "vi": "Tanzania nằm ở Châu Phi.",
        "en": "Tanzania is in Africa.",
        "question": "Tanzania nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "tz-capital-dodoma",
        "category": "capital",
        "vi": "Thủ đô của Tanzania là Dodoma.",
        "en": "The capital of Tanzania is Dodoma.",
        "question": "Thủ đô của Tanzania là thành phố nào?",
        "answers": [
          "Dodoma",
          "Dar es Salaam",
          "Arusha",
          "Zanzibar"
        ]
      },
      {
        "id": "tz-geography-coast",
        "category": "geography",
        "vi": "Tanzania giáp Ấn Độ Dương.",
        "en": "Tanzania borders the Ấn Độ Dương.",
        "question": "Tanzania giáp biển hoặc đại dương nào?",
        "answers": [
          "Ấn Độ Dương",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "tz-nature-kilimanjaro",
        "category": "nature",
        "vi": "Núi Kilimanjaro ở Tanzania là ngọn núi cao nhất châu Phi.",
        "en": "Mount Kilimanjaro in Tanzania is Africa's highest mountain.",
        "question": "Ngọn núi cao nhất châu Phi ở Tanzania tên là gì?",
        "answers": [
          "Núi Kilimanjaro",
          "Núi Everest",
          "Núi Phú Sĩ",
          "Núi Alps"
        ]
      }
    ]
  },
  {
    "id": "tg",
    "isoCode": "TG",
    "name": "Togo",
    "officialName": "Cộng hòa Togo",
    "nameEn": "Togo",
    "officialNameEn": "Togolese Republic",
    "flag": "🇹🇬",
    "capital": "Lomé",
    "capitalEn": "Lomé",
    "continent": "africa",
    "region": "Tây Phi",
    "subRegion": "Vịnh Guinea",
    "languages": [
      "fr"
    ],
    "currency": "Franc CFA",
    "neighbors": [
      "gh",
      "bf",
      "bj"
    ],
    "geo": "coastal",
    "landscape": "tropical",
    "flagColors": [
      "green",
      "yellow",
      "red"
    ],
    "altCities": [
      "Sokodé",
      "Kara"
    ],
    "facts": [
      {
        "id": "tg-geography-continent",
        "category": "geography",
        "vi": "Togo nằm ở Châu Phi.",
        "en": "Togo is in Africa.",
        "question": "Togo nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "tg-capital-lomé",
        "category": "capital",
        "vi": "Thủ đô của Togo là Lomé.",
        "en": "The capital of Togo is Lomé.",
        "question": "Thủ đô của Togo là thành phố nào?",
        "answers": [
          "Lomé",
          "Sokodé",
          "Kara",
          "Paris"
        ]
      },
      {
        "id": "tg-geography-coast",
        "category": "geography",
        "vi": "Togo giáp Vịnh Guinea.",
        "en": "Togo borders the Vịnh Guinea.",
        "question": "Togo giáp biển hoặc đại dương nào?",
        "answers": [
          "Vịnh Guinea",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "tg-geography-narrow",
        "category": "geography",
        "vi": "Togo là quốc gia hẹp, chạy từ vùng nội địa ra Vịnh Guinea.",
        "en": "Togo is a narrow country running from inland to the Gulf of Guinea.",
        "question": "Togo giáp vịnh nào?",
        "answers": [
          "Vịnh Guinea",
          "Vịnh Bengal",
          "Vịnh Mexico",
          "Vịnh Ba Tư"
        ]
      }
    ]
  },
  {
    "id": "tn",
    "isoCode": "TN",
    "name": "Tunisia",
    "officialName": "Cộng hòa Tunisia",
    "nameEn": "Tunisia",
    "officialNameEn": "Republic of Tunisia",
    "flag": "🇹🇳",
    "capital": "Tunis",
    "capitalEn": "Tunis",
    "continent": "africa",
    "region": "Bắc Phi",
    "subRegion": "Maghreb",
    "languages": [
      "ar"
    ],
    "currency": "Dinar",
    "neighbors": [
      "dz",
      "ly"
    ],
    "geo": "coastal",
    "landscape": "temperate",
    "flagColors": [
      "red",
      "white"
    ],
    "altCities": [
      "Sfax",
      "Sousse",
      "Kairouan"
    ],
    "facts": [
      {
        "id": "tn-geography-continent",
        "category": "geography",
        "vi": "Tunisia nằm ở Châu Phi.",
        "en": "Tunisia is in Africa.",
        "question": "Tunisia nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "tn-capital-tunis",
        "category": "capital",
        "vi": "Thủ đô của Tunisia là Tunis.",
        "en": "The capital of Tunisia is Tunis.",
        "question": "Thủ đô của Tunisia là thành phố nào?",
        "answers": [
          "Tunis",
          "Sfax",
          "Sousse",
          "Kairouan"
        ]
      },
      {
        "id": "tn-geography-coast",
        "category": "geography",
        "vi": "Tunisia giáp Địa Trung Hải.",
        "en": "Tunisia borders the Địa Trung Hải.",
        "question": "Tunisia giáp biển hoặc đại dương nào?",
        "answers": [
          "Địa Trung Hải",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "tn-geography-med",
        "category": "geography",
        "vi": "Tunisia nằm trên bờ Địa Trung Hải của Bắc Phi.",
        "en": "Tunisia sits on North Africa's Mediterranean coast.",
        "question": "Tunisia giáp biển nào?",
        "answers": [
          "Địa Trung Hải",
          "Biển Baltic",
          "Thái Bình Dương",
          "Biển Đỏ"
        ]
      }
    ]
  },
  {
    "id": "ug",
    "isoCode": "UG",
    "name": "Uganda",
    "officialName": "Cộng hòa Uganda",
    "nameEn": "Uganda",
    "officialNameEn": "Republic of Uganda",
    "flag": "🇺🇬",
    "capital": "Kampala",
    "capitalEn": "Kampala",
    "continent": "africa",
    "region": "Đông Phi",
    "subRegion": "Hồ Lớn châu Phi",
    "languages": [
      "en",
      "sw"
    ],
    "currency": "Shilling",
    "neighbors": [
      "ss",
      "ke",
      "tz",
      "rw",
      "cd"
    ],
    "geo": "landlocked",
    "landscape": "tropical",
    "flagColors": [
      "black",
      "yellow",
      "red"
    ],
    "altCities": [
      "Entebbe",
      "Gulu",
      "Mbarara"
    ],
    "facts": [
      {
        "id": "ug-geography-continent",
        "category": "geography",
        "vi": "Uganda nằm ở Châu Phi.",
        "en": "Uganda is in Africa.",
        "question": "Uganda nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "ug-capital-kampala",
        "category": "capital",
        "vi": "Thủ đô của Uganda là Kampala.",
        "en": "The capital of Uganda is Kampala.",
        "question": "Thủ đô của Uganda là thành phố nào?",
        "answers": [
          "Kampala",
          "Entebbe",
          "Gulu",
          "Mbarara"
        ]
      },
      {
        "id": "ug-geography-landlocked",
        "category": "geography",
        "vi": "Uganda không giáp biển.",
        "en": "Uganda is landlocked.",
        "question": "Điều nào đúng về Uganda?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "ug-geography-nile",
        "category": "geography",
        "vi": "Một nguồn của sông Nile bắt đầu từ Uganda.",
        "en": "A source of the Nile River begins in Uganda.",
        "question": "Con sông lớn có một nguồn ở Uganda tên là gì?",
        "answers": [
          "Sông Nile",
          "Sông Amazon",
          "Sông Mekong",
          "Sông Danube"
        ]
      }
    ]
  },
  {
    "id": "zm",
    "isoCode": "ZM",
    "name": "Zambia",
    "officialName": "Cộng hòa Zambia",
    "nameEn": "Zambia",
    "officialNameEn": "Republic of Zambia",
    "flag": "🇿🇲",
    "capital": "Lusaka",
    "capitalEn": "Lusaka",
    "continent": "africa",
    "region": "Đông Phi",
    "subRegion": "Đồng bằng phía Nam",
    "languages": [
      "en"
    ],
    "currency": "Kwacha",
    "neighbors": [
      "cd",
      "tz",
      "mw",
      "mz",
      "zw",
      "bw",
      "na",
      "ao"
    ],
    "geo": "landlocked",
    "landscape": "tropical",
    "flagColors": [
      "green",
      "red",
      "orange"
    ],
    "altCities": [
      "Ndola",
      "Livingstone",
      "Kitwe"
    ],
    "facts": [
      {
        "id": "zm-geography-continent",
        "category": "geography",
        "vi": "Zambia nằm ở Châu Phi.",
        "en": "Zambia is in Africa.",
        "question": "Zambia nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "zm-capital-lusaka",
        "category": "capital",
        "vi": "Thủ đô của Zambia là Lusaka.",
        "en": "The capital of Zambia is Lusaka.",
        "question": "Thủ đô của Zambia là thành phố nào?",
        "answers": [
          "Lusaka",
          "Ndola",
          "Livingstone",
          "Kitwe"
        ]
      },
      {
        "id": "zm-geography-landlocked",
        "category": "geography",
        "vi": "Zambia không giáp biển.",
        "en": "Zambia is landlocked.",
        "question": "Điều nào đúng về Zambia?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "zm-nature-victoria",
        "category": "nature",
        "vi": "Thác Victoria nằm trên sông Zambezi, giữa Zambia và Zimbabwe.",
        "en": "Victoria Falls is on the Zambezi River between Zambia and Zimbabwe.",
        "question": "Thác nước lớn giữa Zambia và Zimbabwe tên là gì?",
        "answers": [
          "Thác Victoria",
          "Thác Niagara",
          "Thác Angel",
          "Thác Iguazu"
        ]
      }
    ]
  },
  {
    "id": "zw",
    "isoCode": "ZW",
    "name": "Zimbabwe",
    "officialName": "Cộng hòa Zimbabwe",
    "nameEn": "Zimbabwe",
    "officialNameEn": "Republic of Zimbabwe",
    "flag": "🇿🇼",
    "capital": "Harare",
    "capitalEn": "Harare",
    "continent": "africa",
    "region": "Đông Phi",
    "subRegion": "Cao nguyên phía Nam",
    "languages": [
      "en",
      "sn"
    ],
    "currency": "Đô la",
    "neighbors": [
      "za",
      "bw",
      "zm",
      "mz"
    ],
    "geo": "landlocked",
    "landscape": "temperate",
    "flagColors": [
      "green",
      "yellow",
      "red",
      "black"
    ],
    "altCities": [
      "Bulawayo",
      "Mutare",
      "Victoria Falls"
    ],
    "facts": [
      {
        "id": "zw-geography-continent",
        "category": "geography",
        "vi": "Zimbabwe nằm ở Châu Phi.",
        "en": "Zimbabwe is in Africa.",
        "question": "Zimbabwe nằm ở châu lục nào?",
        "answers": [
          "Châu Phi",
          "Châu Á",
          "Châu Âu",
          "Nam Mỹ"
        ]
      },
      {
        "id": "zw-capital-harare",
        "category": "capital",
        "vi": "Thủ đô của Zimbabwe là Harare.",
        "en": "The capital of Zimbabwe is Harare.",
        "question": "Thủ đô của Zimbabwe là thành phố nào?",
        "answers": [
          "Harare",
          "Bulawayo",
          "Mutare",
          "Victoria Falls"
        ]
      },
      {
        "id": "zw-geography-landlocked",
        "category": "geography",
        "vi": "Zimbabwe không giáp biển.",
        "en": "Zimbabwe is landlocked.",
        "question": "Điều nào đúng về Zimbabwe?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "zw-nature-victoria",
        "category": "nature",
        "vi": "Thác Victoria nhìn từ Zimbabwe rất rộng và có nhiều hơi nước.",
        "en": "Victoria Falls seen from Zimbabwe is very wide and misty.",
        "question": "Thác nước nổi tiếng ở Zimbabwe tên là gì?",
        "answers": [
          "Thác Victoria",
          "Thác Niagara",
          "Thác Angel",
          "Thác Iguazu"
        ]
      }
    ]
  },
  {
    "id": "ag",
    "isoCode": "AG",
    "name": "Antigua và Barbuda",
    "officialName": "Antigua và Barbuda",
    "nameEn": "Antigua and Barbuda",
    "officialNameEn": "Antigua and Barbuda",
    "flag": "🇦🇬",
    "capital": "Saint John's",
    "capitalEn": "Saint John's",
    "continent": "north_america",
    "region": "Caribe",
    "subRegion": "Quần đảo Leeward",
    "languages": [
      "en"
    ],
    "currency": "Đô la Đông Caribe",
    "neighbors": [],
    "geo": "island",
    "landscape": "island",
    "flagColors": [
      "red",
      "blue",
      "white",
      "yellow"
    ],
    "altCities": [
      "All Saints",
      "Liberta"
    ],
    "facts": [
      {
        "id": "ag-geography-continent",
        "category": "geography",
        "vi": "Antigua và Barbuda nằm ở Bắc Mỹ.",
        "en": "Antigua and Barbuda is in North America.",
        "question": "Antigua và Barbuda nằm ở châu lục nào?",
        "answers": [
          "Bắc Mỹ",
          "Nam Mỹ",
          "Châu Âu",
          "Châu Á"
        ]
      },
      {
        "id": "ag-capital-saint-john-s",
        "category": "capital",
        "vi": "Thủ đô của Antigua và Barbuda là Saint John's.",
        "en": "The capital of Antigua and Barbuda is Saint John's.",
        "question": "Thủ đô của Antigua và Barbuda là thành phố nào?",
        "answers": [
          "Saint John's",
          "All Saints",
          "Liberta",
          "Paris"
        ]
      },
      {
        "id": "ag-geography-island",
        "category": "geography",
        "vi": "Antigua và Barbuda là một quốc gia đảo.",
        "en": "Antigua and Barbuda is an island country.",
        "question": "Điều nào đúng về Antigua và Barbuda?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "ag-geography-islands",
        "category": "geography",
        "vi": "Antigua và Barbuda là quốc gia hai đảo ở Caribe.",
        "en": "Antigua and Barbuda is a two-island country in the Caribbean.",
        "question": "Antigua và Barbuda nằm ở vùng biển nào?",
        "answers": [
          "Caribe",
          "Baltic",
          "Địa Trung Hải",
          "Biển Đỏ"
        ]
      }
    ]
  },
  {
    "id": "bs",
    "isoCode": "BS",
    "name": "Bahamas",
    "officialName": "Thịnh vượng chung Bahamas",
    "nameEn": "Bahamas",
    "officialNameEn": "Commonwealth of the Bahamas",
    "flag": "🇧🇸",
    "capital": "Nassau",
    "capitalEn": "Nassau",
    "continent": "north_america",
    "region": "Caribe",
    "subRegion": "Quần đảo Bahamas",
    "languages": [
      "en"
    ],
    "currency": "Đô la Bahamas",
    "neighbors": [],
    "geo": "island",
    "landscape": "island",
    "flagColors": [
      "blue",
      "yellow",
      "black"
    ],
    "altCities": [
      "Freeport",
      "Marsh Harbour"
    ],
    "facts": [
      {
        "id": "bs-geography-continent",
        "category": "geography",
        "vi": "Bahamas nằm ở Bắc Mỹ.",
        "en": "Bahamas is in North America.",
        "question": "Bahamas nằm ở châu lục nào?",
        "answers": [
          "Bắc Mỹ",
          "Nam Mỹ",
          "Châu Âu",
          "Châu Á"
        ]
      },
      {
        "id": "bs-capital-nassau",
        "category": "capital",
        "vi": "Thủ đô của Bahamas là Nassau.",
        "en": "The capital of Bahamas is Nassau.",
        "question": "Thủ đô của Bahamas là thành phố nào?",
        "answers": [
          "Nassau",
          "Freeport",
          "Marsh Harbour",
          "Paris"
        ]
      },
      {
        "id": "bs-geography-island",
        "category": "geography",
        "vi": "Bahamas là một quốc gia đảo.",
        "en": "Bahamas is an island country.",
        "question": "Điều nào đúng về Bahamas?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "bs-geography-islands",
        "category": "geography",
        "vi": "Bahamas gồm hàng trăm hòn đảo trên Đại Tây Dương.",
        "en": "The Bahamas is made of hundreds of islands in the Atlantic.",
        "question": "Bahamas gồm rất nhiều thứ gì?",
        "answers": [
          "Hòn đảo",
          "Sa mạc",
          "Sông băng",
          "Núi lửa băng"
        ]
      }
    ]
  },
  {
    "id": "bb",
    "isoCode": "BB",
    "name": "Barbados",
    "officialName": "Barbados",
    "nameEn": "Barbados",
    "officialNameEn": "Barbados",
    "flag": "🇧🇧",
    "capital": "Bridgetown",
    "capitalEn": "Bridgetown",
    "continent": "north_america",
    "region": "Caribe",
    "subRegion": "Quần đảo Windward",
    "languages": [
      "en"
    ],
    "currency": "Đô la Barbados",
    "neighbors": [],
    "geo": "island",
    "landscape": "island",
    "flagColors": [
      "blue",
      "yellow",
      "black"
    ],
    "altCities": [
      "Speightstown",
      "Oistins"
    ],
    "facts": [
      {
        "id": "bb-geography-continent",
        "category": "geography",
        "vi": "Barbados nằm ở Bắc Mỹ.",
        "en": "Barbados is in North America.",
        "question": "Barbados nằm ở châu lục nào?",
        "answers": [
          "Bắc Mỹ",
          "Nam Mỹ",
          "Châu Âu",
          "Châu Á"
        ]
      },
      {
        "id": "bb-capital-bridgetown",
        "category": "capital",
        "vi": "Thủ đô của Barbados là Bridgetown.",
        "en": "The capital of Barbados is Bridgetown.",
        "question": "Thủ đô của Barbados là thành phố nào?",
        "answers": [
          "Bridgetown",
          "Speightstown",
          "Oistins",
          "Paris"
        ]
      },
      {
        "id": "bb-geography-island",
        "category": "geography",
        "vi": "Barbados là một quốc gia đảo.",
        "en": "Barbados is an island country.",
        "question": "Điều nào đúng về Barbados?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "bb-language-en",
        "category": "language",
        "vi": "Người dân Barbados nói tiếng Anh.",
        "en": "People in Barbados speak tiếng Anh.",
        "question": "Người dân Barbados nói ngôn ngữ nào?",
        "answers": [
          "tiếng Anh",
          "tiếng Việt",
          "tiếng Nhật",
          "tiếng Inuit"
        ]
      }
    ]
  },
  {
    "id": "bz",
    "isoCode": "BZ",
    "name": "Belize",
    "officialName": "Belize",
    "nameEn": "Belize",
    "officialNameEn": "Belize",
    "flag": "🇧🇿",
    "capital": "Belmopan",
    "capitalEn": "Belmopan",
    "continent": "north_america",
    "region": "Trung Mỹ",
    "subRegion": "Bán đảo Yucatán",
    "languages": [
      "en"
    ],
    "currency": "Đô la Belize",
    "neighbors": [
      "mx",
      "gt"
    ],
    "geo": "coastal",
    "landscape": "rainforest",
    "flagColors": [
      "blue",
      "red"
    ],
    "altCities": [
      "Belize City",
      "San Ignacio"
    ],
    "facts": [
      {
        "id": "bz-geography-continent",
        "category": "geography",
        "vi": "Belize nằm ở Bắc Mỹ.",
        "en": "Belize is in North America.",
        "question": "Belize nằm ở châu lục nào?",
        "answers": [
          "Bắc Mỹ",
          "Nam Mỹ",
          "Châu Âu",
          "Châu Á"
        ]
      },
      {
        "id": "bz-capital-belmopan",
        "category": "capital",
        "vi": "Thủ đô của Belize là Belmopan.",
        "en": "The capital of Belize is Belmopan.",
        "question": "Thủ đô của Belize là thành phố nào?",
        "answers": [
          "Belmopan",
          "Belize City",
          "San Ignacio",
          "Paris"
        ]
      },
      {
        "id": "bz-geography-coast",
        "category": "geography",
        "vi": "Belize giáp Biển Caribe.",
        "en": "Belize borders the Biển Caribe.",
        "question": "Belize giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Caribe",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "bz-language-english",
        "category": "language",
        "vi": "Belize là quốc gia Trung Mỹ nói tiếng Anh.",
        "en": "Belize is a Central American country where English is spoken.",
        "question": "Người dân Belize nói ngôn ngữ chính nào?",
        "answers": [
          "Tiếng Anh",
          "Tiếng Tây Ban Nha",
          "Tiếng Pháp",
          "Tiếng Bồ Đào Nha"
        ]
      }
    ]
  },
  {
    "id": "ca",
    "isoCode": "CA",
    "name": "Canada",
    "officialName": "Canada",
    "nameEn": "Canada",
    "officialNameEn": "Canada",
    "flag": "🇨🇦",
    "capital": "Ottawa",
    "capitalEn": "Ottawa",
    "continent": "north_america",
    "region": "Bắc Mỹ",
    "subRegion": "Bắc Mỹ",
    "languages": [
      "en",
      "fr"
    ],
    "currency": "Đô la Canada",
    "neighbors": [
      "us"
    ],
    "geo": "coastal",
    "landscape": "temperate",
    "flagColors": [
      "red",
      "white"
    ],
    "altCities": [
      "Toronto",
      "Vancouver",
      "Montreal",
      "Calgary"
    ],
    "facts": [
      {
        "id": "ca-geography-continent",
        "category": "geography",
        "vi": "Canada nằm ở Bắc Mỹ.",
        "en": "Canada is in North America.",
        "question": "Canada nằm ở châu lục nào?",
        "answers": [
          "Bắc Mỹ",
          "Nam Mỹ",
          "Châu Âu",
          "Châu Á"
        ]
      },
      {
        "id": "ca-capital-ottawa",
        "category": "capital",
        "vi": "Thủ đô của Canada là Ottawa.",
        "en": "The capital of Canada is Ottawa.",
        "question": "Thủ đô của Canada là thành phố nào?",
        "answers": [
          "Ottawa",
          "Toronto",
          "Vancouver",
          "Montreal"
        ]
      },
      {
        "id": "ca-geography-coast",
        "category": "geography",
        "vi": "Canada giáp Bắc Băng Dương.",
        "en": "Canada borders the Bắc Băng Dương.",
        "question": "Canada giáp biển hoặc đại dương nào?",
        "answers": [
          "Bắc Băng Dương",
          "Địa Trung Hải",
          "Thái Bình Dương",
          "Ấn Độ Dương"
        ]
      },
      {
        "id": "ca-nature-maple",
        "category": "nature",
        "vi": "Lá phong xuất hiện trên quốc kỳ Canada.",
        "en": "A maple leaf appears on the flag of Canada.",
        "question": "Lá cây nào có trên quốc kỳ Canada?",
        "answers": [
          "Lá phong",
          "Lá sen",
          "Lá tre",
          "Lá dừa"
        ]
      },
      {
        "id": "ca-nature-niagara",
        "category": "nature",
        "vi": "Thác Niagara nằm trên biên giới Canada và Mỹ.",
        "en": "Niagara Falls sits on the border of Canada and the United States.",
        "question": "Thác nước nổi tiếng giữa Canada và Mỹ tên là gì?",
        "answers": [
          "Thác Niagara",
          "Thác Victoria",
          "Thác Angel",
          "Thác Iguazu"
        ]
      }
    ]
  },
  {
    "id": "cr",
    "isoCode": "CR",
    "name": "Costa Rica",
    "officialName": "Cộng hòa Costa Rica",
    "nameEn": "Costa Rica",
    "officialNameEn": "Republic of Costa Rica",
    "flag": "🇨🇷",
    "capital": "San José",
    "capitalEn": "San José",
    "continent": "north_america",
    "region": "Trung Mỹ",
    "subRegion": "Eo đất Trung Mỹ",
    "languages": [
      "es"
    ],
    "currency": "Colón",
    "neighbors": [
      "ni",
      "pa"
    ],
    "geo": "coastal",
    "landscape": "rainforest",
    "flagColors": [
      "blue",
      "white",
      "red"
    ],
    "altCities": [
      "Limón",
      "Alajuela",
      "Puntarenas"
    ],
    "facts": [
      {
        "id": "cr-geography-continent",
        "category": "geography",
        "vi": "Costa Rica nằm ở Bắc Mỹ.",
        "en": "Costa Rica is in North America.",
        "question": "Costa Rica nằm ở châu lục nào?",
        "answers": [
          "Bắc Mỹ",
          "Nam Mỹ",
          "Châu Âu",
          "Châu Á"
        ]
      },
      {
        "id": "cr-capital-san-josé",
        "category": "capital",
        "vi": "Thủ đô của Costa Rica là San José.",
        "en": "The capital of Costa Rica is San José.",
        "question": "Thủ đô của Costa Rica là thành phố nào?",
        "answers": [
          "San José",
          "Limón",
          "Alajuela",
          "Puntarenas"
        ]
      },
      {
        "id": "cr-geography-coast",
        "category": "geography",
        "vi": "Costa Rica giáp Biển Caribe.",
        "en": "Costa Rica borders the Biển Caribe.",
        "question": "Costa Rica giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Caribe",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "cr-nature-rainforest",
        "category": "nature",
        "vi": "Costa Rica có rừng mưa và nhiều công viên quốc gia.",
        "en": "Costa Rica has rainforests and many national parks.",
        "question": "Costa Rica nổi tiếng với kiểu rừng nào?",
        "answers": [
          "Rừng mưa",
          "Rừng thông Bắc Cực",
          "Rừng xương rồng",
          "Rừng bạch dương"
        ]
      }
    ]
  },
  {
    "id": "cu",
    "isoCode": "CU",
    "name": "Cuba",
    "officialName": "Cộng hòa Cuba",
    "nameEn": "Cuba",
    "officialNameEn": "Republic of Cuba",
    "flag": "🇨🇺",
    "capital": "Havana",
    "capitalEn": "Havana",
    "continent": "north_america",
    "region": "Caribe",
    "subRegion": "Đại Antilles",
    "languages": [
      "es"
    ],
    "currency": "Peso",
    "neighbors": [],
    "geo": "island",
    "landscape": "tropical",
    "flagColors": [
      "blue",
      "white",
      "red"
    ],
    "altCities": [
      "Santiago de Cuba",
      "Camagüey",
      "Trinidad"
    ],
    "facts": [
      {
        "id": "cu-geography-continent",
        "category": "geography",
        "vi": "Cuba nằm ở Bắc Mỹ.",
        "en": "Cuba is in North America.",
        "question": "Cuba nằm ở châu lục nào?",
        "answers": [
          "Bắc Mỹ",
          "Nam Mỹ",
          "Châu Âu",
          "Châu Á"
        ]
      },
      {
        "id": "cu-capital-havana",
        "category": "capital",
        "vi": "Thủ đô của Cuba là Havana.",
        "en": "The capital of Cuba is Havana.",
        "question": "Thủ đô của Cuba là thành phố nào?",
        "answers": [
          "Havana",
          "Santiago de Cuba",
          "Camagüey",
          "Trinidad"
        ]
      },
      {
        "id": "cu-geography-island",
        "category": "geography",
        "vi": "Cuba là một quốc gia đảo.",
        "en": "Cuba is an island country.",
        "question": "Điều nào đúng về Cuba?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "cu-language-es",
        "category": "language",
        "vi": "Người dân Cuba nói tiếng Tây Ban Nha.",
        "en": "People in Cuba speak tiếng Tây Ban Nha.",
        "question": "Người dân Cuba nói ngôn ngữ nào?",
        "answers": [
          "tiếng Tây Ban Nha",
          "tiếng Việt",
          "tiếng Nhật",
          "tiếng Inuit"
        ]
      }
    ]
  },
  {
    "id": "dm",
    "isoCode": "DM",
    "name": "Dominica",
    "officialName": "Thịnh vượng chung Dominica",
    "nameEn": "Dominica",
    "officialNameEn": "Commonwealth of Dominica",
    "flag": "🇩🇲",
    "capital": "Roseau",
    "capitalEn": "Roseau",
    "continent": "north_america",
    "region": "Caribe",
    "subRegion": "Quần đảo Windward",
    "languages": [
      "en"
    ],
    "currency": "Đô la Đông Caribe",
    "neighbors": [],
    "geo": "island",
    "landscape": "island",
    "flagColors": [
      "green",
      "yellow",
      "black",
      "white"
    ],
    "altCities": [
      "Portsmouth",
      "Marigot"
    ],
    "facts": [
      {
        "id": "dm-geography-continent",
        "category": "geography",
        "vi": "Dominica nằm ở Bắc Mỹ.",
        "en": "Dominica is in North America.",
        "question": "Dominica nằm ở châu lục nào?",
        "answers": [
          "Bắc Mỹ",
          "Nam Mỹ",
          "Châu Âu",
          "Châu Á"
        ]
      },
      {
        "id": "dm-capital-roseau",
        "category": "capital",
        "vi": "Thủ đô của Dominica là Roseau.",
        "en": "The capital of Dominica is Roseau.",
        "question": "Thủ đô của Dominica là thành phố nào?",
        "answers": [
          "Roseau",
          "Portsmouth",
          "Marigot",
          "Paris"
        ]
      },
      {
        "id": "dm-geography-island",
        "category": "geography",
        "vi": "Dominica là một quốc gia đảo.",
        "en": "Dominica is an island country.",
        "question": "Điều nào đúng về Dominica?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "dm-nature-rainforest",
        "category": "nature",
        "vi": "Dominica có rừng mưa xanh và nhiều sông suối.",
        "en": "Dominica has green rainforests and many rivers.",
        "question": "Dominica nổi tiếng với kiểu thiên nhiên nào?",
        "answers": [
          "Rừng mưa",
          "Sa mạc cát",
          "Sông băng",
          "Thảo nguyên khô"
        ]
      }
    ]
  },
  {
    "id": "do",
    "isoCode": "DO",
    "name": "Cộng hòa Dominica",
    "officialName": "Cộng hòa Dominica",
    "nameEn": "Dominican Republic",
    "officialNameEn": "Dominican Republic",
    "flag": "🇩🇴",
    "capital": "Santo Domingo",
    "capitalEn": "Santo Domingo",
    "continent": "north_america",
    "region": "Caribe",
    "subRegion": "Đảo Hispaniola",
    "languages": [
      "es"
    ],
    "currency": "Peso",
    "neighbors": [
      "ht"
    ],
    "geo": "island",
    "landscape": "tropical",
    "flagColors": [
      "blue",
      "red",
      "white"
    ],
    "altCities": [
      "Santiago",
      "Punta Cana",
      "Puerto Plata"
    ],
    "facts": [
      {
        "id": "do-geography-continent",
        "category": "geography",
        "vi": "Cộng hòa Dominica nằm ở Bắc Mỹ.",
        "en": "Dominican Republic is in North America.",
        "question": "Cộng hòa Dominica nằm ở châu lục nào?",
        "answers": [
          "Bắc Mỹ",
          "Nam Mỹ",
          "Châu Âu",
          "Châu Á"
        ]
      },
      {
        "id": "do-capital-santo-domingo",
        "category": "capital",
        "vi": "Thủ đô của Cộng hòa Dominica là Santo Domingo.",
        "en": "The capital of Dominican Republic is Santo Domingo.",
        "question": "Thủ đô của Cộng hòa Dominica là thành phố nào?",
        "answers": [
          "Santo Domingo",
          "Santiago",
          "Punta Cana",
          "Puerto Plata"
        ]
      },
      {
        "id": "do-geography-island",
        "category": "geography",
        "vi": "Cộng hòa Dominica là một quốc gia đảo.",
        "en": "Dominican Republic is an island country.",
        "question": "Điều nào đúng về Cộng hòa Dominica?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "do-geography-hispaniola",
        "category": "geography",
        "vi": "Cộng hòa Dominica nằm trên đảo Hispaniola.",
        "en": "The Dominican Republic is on the island of Hispaniola.",
        "question": "Cộng hòa Dominica nằm trên đảo nào?",
        "answers": [
          "Hispaniola",
          "Cuba",
          "Jamaica",
          "Ireland"
        ]
      }
    ]
  },
  {
    "id": "sv",
    "isoCode": "SV",
    "name": "El Salvador",
    "officialName": "Cộng hòa El Salvador",
    "nameEn": "El Salvador",
    "officialNameEn": "Republic of El Salvador",
    "flag": "🇸🇻",
    "capital": "San Salvador",
    "capitalEn": "San Salvador",
    "continent": "north_america",
    "region": "Trung Mỹ",
    "subRegion": "Eo đất Trung Mỹ",
    "languages": [
      "es"
    ],
    "currency": "Đô la Mỹ",
    "neighbors": [
      "gt",
      "hn"
    ],
    "geo": "coastal",
    "landscape": "tropical",
    "flagColors": [
      "blue",
      "white"
    ],
    "altCities": [
      "Santa Ana",
      "San Miguel"
    ],
    "facts": [
      {
        "id": "sv-geography-continent",
        "category": "geography",
        "vi": "El Salvador nằm ở Bắc Mỹ.",
        "en": "El Salvador is in North America.",
        "question": "El Salvador nằm ở châu lục nào?",
        "answers": [
          "Bắc Mỹ",
          "Nam Mỹ",
          "Châu Âu",
          "Châu Á"
        ]
      },
      {
        "id": "sv-capital-san-salvador",
        "category": "capital",
        "vi": "Thủ đô của El Salvador là San Salvador.",
        "en": "The capital of El Salvador is San Salvador.",
        "question": "Thủ đô của El Salvador là thành phố nào?",
        "answers": [
          "San Salvador",
          "Santa Ana",
          "San Miguel",
          "Paris"
        ]
      },
      {
        "id": "sv-geography-coast",
        "category": "geography",
        "vi": "El Salvador giáp Thái Bình Dương.",
        "en": "El Salvador borders the Thái Bình Dương.",
        "question": "El Salvador giáp biển hoặc đại dương nào?",
        "answers": [
          "Thái Bình Dương",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "sv-geography-pacific",
        "category": "geography",
        "vi": "El Salvador chỉ giáp Thái Bình Dương, không giáp Biển Caribe.",
        "en": "El Salvador only meets the Pacific Ocean, not the Caribbean Sea.",
        "question": "El Salvador giáp đại dương nào?",
        "answers": [
          "Thái Bình Dương",
          "Đại Tây Dương",
          "Ấn Độ Dương",
          "Bắc Băng Dương"
        ]
      }
    ]
  },
  {
    "id": "gd",
    "isoCode": "GD",
    "name": "Grenada",
    "officialName": "Grenada",
    "nameEn": "Grenada",
    "officialNameEn": "Grenada",
    "flag": "🇬🇩",
    "capital": "Saint George's",
    "capitalEn": "Saint George's",
    "continent": "north_america",
    "region": "Caribe",
    "subRegion": "Quần đảo Windward",
    "languages": [
      "en"
    ],
    "currency": "Đô la Đông Caribe",
    "neighbors": [],
    "geo": "island",
    "landscape": "island",
    "flagColors": [
      "red",
      "yellow",
      "green"
    ],
    "altCities": [
      "Gouyave",
      "Grenville"
    ],
    "facts": [
      {
        "id": "gd-geography-continent",
        "category": "geography",
        "vi": "Grenada nằm ở Bắc Mỹ.",
        "en": "Grenada is in North America.",
        "question": "Grenada nằm ở châu lục nào?",
        "answers": [
          "Bắc Mỹ",
          "Nam Mỹ",
          "Châu Âu",
          "Châu Á"
        ]
      },
      {
        "id": "gd-capital-saint-george-s",
        "category": "capital",
        "vi": "Thủ đô của Grenada là Saint George's.",
        "en": "The capital of Grenada is Saint George's.",
        "question": "Thủ đô của Grenada là thành phố nào?",
        "answers": [
          "Saint George's",
          "Gouyave",
          "Grenville",
          "Paris"
        ]
      },
      {
        "id": "gd-geography-island",
        "category": "geography",
        "vi": "Grenada là một quốc gia đảo.",
        "en": "Grenada is an island country.",
        "question": "Điều nào đúng về Grenada?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "gd-language-en",
        "category": "language",
        "vi": "Người dân Grenada nói tiếng Anh.",
        "en": "People in Grenada speak tiếng Anh.",
        "question": "Người dân Grenada nói ngôn ngữ nào?",
        "answers": [
          "tiếng Anh",
          "tiếng Việt",
          "tiếng Nhật",
          "tiếng Inuit"
        ]
      }
    ]
  },
  {
    "id": "gt",
    "isoCode": "GT",
    "name": "Guatemala",
    "officialName": "Cộng hòa Guatemala",
    "nameEn": "Guatemala",
    "officialNameEn": "Republic of Guatemala",
    "flag": "🇬🇹",
    "capital": "Thành phố Guatemala",
    "capitalEn": "Guatemala City",
    "continent": "north_america",
    "region": "Trung Mỹ",
    "subRegion": "Eo đất Trung Mỹ",
    "languages": [
      "es"
    ],
    "currency": "Quetzal",
    "neighbors": [
      "mx",
      "bz",
      "hn",
      "sv"
    ],
    "geo": "coastal",
    "landscape": "mountain",
    "flagColors": [
      "blue",
      "white"
    ],
    "altCities": [
      "Antigua",
      "Quetzaltenango",
      "Flores"
    ],
    "facts": [
      {
        "id": "gt-geography-continent",
        "category": "geography",
        "vi": "Guatemala nằm ở Bắc Mỹ.",
        "en": "Guatemala is in North America.",
        "question": "Guatemala nằm ở châu lục nào?",
        "answers": [
          "Bắc Mỹ",
          "Nam Mỹ",
          "Châu Âu",
          "Châu Á"
        ]
      },
      {
        "id": "gt-capital-guatemala-city",
        "category": "capital",
        "vi": "Thủ đô của Guatemala là Thành phố Guatemala.",
        "en": "The capital of Guatemala is Guatemala City.",
        "question": "Thủ đô của Guatemala là thành phố nào?",
        "answers": [
          "Thành phố Guatemala",
          "Antigua",
          "Quetzaltenango",
          "Flores"
        ]
      },
      {
        "id": "gt-geography-coast",
        "category": "geography",
        "vi": "Guatemala giáp Thái Bình Dương.",
        "en": "Guatemala borders the Thái Bình Dương.",
        "question": "Guatemala giáp biển hoặc đại dương nào?",
        "answers": [
          "Thái Bình Dương",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "gt-landmarks-tikal",
        "category": "landmarks",
        "vi": "Tikal là thành phố đá cổ của người Maya ở Guatemala.",
        "en": "Tikal is an ancient Maya stone city in Guatemala.",
        "question": "Thành phố Maya cổ ở Guatemala tên là gì?",
        "answers": [
          "Tikal",
          "Roma",
          "Athens",
          "Kyoto"
        ]
      }
    ]
  },
  {
    "id": "ht",
    "isoCode": "HT",
    "name": "Haiti",
    "officialName": "Cộng hòa Haiti",
    "nameEn": "Haiti",
    "officialNameEn": "Republic of Haiti",
    "flag": "🇭🇹",
    "capital": "Port-au-Prince",
    "capitalEn": "Port-au-Prince",
    "continent": "north_america",
    "region": "Caribe",
    "subRegion": "Đảo Hispaniola",
    "languages": [
      "ht",
      "fr"
    ],
    "currency": "Gourde",
    "neighbors": [
      "do"
    ],
    "geo": "island",
    "landscape": "tropical",
    "flagColors": [
      "blue",
      "red"
    ],
    "altCities": [
      "Cap-Haïtien",
      "Jacmel",
      "Gonaïves"
    ],
    "facts": [
      {
        "id": "ht-geography-continent",
        "category": "geography",
        "vi": "Haiti nằm ở Bắc Mỹ.",
        "en": "Haiti is in North America.",
        "question": "Haiti nằm ở châu lục nào?",
        "answers": [
          "Bắc Mỹ",
          "Nam Mỹ",
          "Châu Âu",
          "Châu Á"
        ]
      },
      {
        "id": "ht-capital-port-au-prince",
        "category": "capital",
        "vi": "Thủ đô của Haiti là Port-au-Prince.",
        "en": "The capital of Haiti is Port-au-Prince.",
        "question": "Thủ đô của Haiti là thành phố nào?",
        "answers": [
          "Port-au-Prince",
          "Cap-Haïtien",
          "Jacmel",
          "Gonaïves"
        ]
      },
      {
        "id": "ht-geography-island",
        "category": "geography",
        "vi": "Haiti là một quốc gia đảo.",
        "en": "Haiti is an island country.",
        "question": "Điều nào đúng về Haiti?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "ht-geography-hispaniola",
        "category": "geography",
        "vi": "Haiti nằm trên đảo Hispaniola, chung đảo với Cộng hòa Dominica.",
        "en": "Haiti is on the island of Hispaniola, which it shares with the Dominican Republic.",
        "question": "Haiti nằm trên đảo nào?",
        "answers": [
          "Hispaniola",
          "Cuba",
          "Jamaica",
          "Madagascar"
        ]
      }
    ]
  },
  {
    "id": "hn",
    "isoCode": "HN",
    "name": "Honduras",
    "officialName": "Cộng hòa Honduras",
    "nameEn": "Honduras",
    "officialNameEn": "Republic of Honduras",
    "flag": "🇭🇳",
    "capital": "Tegucigalpa",
    "capitalEn": "Tegucigalpa",
    "continent": "north_america",
    "region": "Trung Mỹ",
    "subRegion": "Eo đất Trung Mỹ",
    "languages": [
      "es"
    ],
    "currency": "Lempira",
    "neighbors": [
      "gt",
      "sv",
      "ni"
    ],
    "geo": "coastal",
    "landscape": "tropical",
    "flagColors": [
      "blue",
      "white"
    ],
    "altCities": [
      "San Pedro Sula",
      "La Ceiba",
      "Comayagua"
    ],
    "facts": [
      {
        "id": "hn-geography-continent",
        "category": "geography",
        "vi": "Honduras nằm ở Bắc Mỹ.",
        "en": "Honduras is in North America.",
        "question": "Honduras nằm ở châu lục nào?",
        "answers": [
          "Bắc Mỹ",
          "Nam Mỹ",
          "Châu Âu",
          "Châu Á"
        ]
      },
      {
        "id": "hn-capital-tegucigalpa",
        "category": "capital",
        "vi": "Thủ đô của Honduras là Tegucigalpa.",
        "en": "The capital of Honduras is Tegucigalpa.",
        "question": "Thủ đô của Honduras là thành phố nào?",
        "answers": [
          "Tegucigalpa",
          "San Pedro Sula",
          "La Ceiba",
          "Comayagua"
        ]
      },
      {
        "id": "hn-geography-coast",
        "category": "geography",
        "vi": "Honduras giáp Biển Caribe.",
        "en": "Honduras borders the Biển Caribe.",
        "question": "Honduras giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Caribe",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "hn-geography-caribbean",
        "category": "geography",
        "vi": "Honduras có bờ biển Caribe dài.",
        "en": "Honduras has a long Caribbean coast.",
        "question": "Honduras giáp biển nào ở phía bắc?",
        "answers": [
          "Biển Caribe",
          "Địa Trung Hải",
          "Biển Baltic",
          "Biển Đỏ"
        ]
      }
    ]
  },
  {
    "id": "jm",
    "isoCode": "JM",
    "name": "Jamaica",
    "officialName": "Jamaica",
    "nameEn": "Jamaica",
    "officialNameEn": "Jamaica",
    "flag": "🇯🇲",
    "capital": "Kingston",
    "capitalEn": "Kingston",
    "continent": "north_america",
    "region": "Caribe",
    "subRegion": "Đại Antilles",
    "languages": [
      "en"
    ],
    "currency": "Đô la Jamaica",
    "neighbors": [],
    "geo": "island",
    "landscape": "tropical",
    "flagColors": [
      "green",
      "yellow",
      "black"
    ],
    "altCities": [
      "Montego Bay",
      "Ocho Rios",
      "Spanish Town"
    ],
    "facts": [
      {
        "id": "jm-geography-continent",
        "category": "geography",
        "vi": "Jamaica nằm ở Bắc Mỹ.",
        "en": "Jamaica is in North America.",
        "question": "Jamaica nằm ở châu lục nào?",
        "answers": [
          "Bắc Mỹ",
          "Nam Mỹ",
          "Châu Âu",
          "Châu Á"
        ]
      },
      {
        "id": "jm-capital-kingston",
        "category": "capital",
        "vi": "Thủ đô của Jamaica là Kingston.",
        "en": "The capital of Jamaica is Kingston.",
        "question": "Thủ đô của Jamaica là thành phố nào?",
        "answers": [
          "Kingston",
          "Montego Bay",
          "Ocho Rios",
          "Spanish Town"
        ]
      },
      {
        "id": "jm-geography-island",
        "category": "geography",
        "vi": "Jamaica là một quốc gia đảo.",
        "en": "Jamaica is an island country.",
        "question": "Điều nào đúng về Jamaica?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "jm-nature-bluemountain",
        "category": "nature",
        "vi": "Núi Blue Mountains ở Jamaica nổi tiếng với đồi cà phê.",
        "en": "The Blue Mountains in Jamaica are famous for coffee hills.",
        "question": "Dãy núi nổi tiếng ở Jamaica tên là gì?",
        "answers": [
          "Blue Mountains",
          "Alps",
          "Andes",
          "Atlas"
        ]
      }
    ]
  },
  {
    "id": "mx",
    "isoCode": "MX",
    "name": "Mexico",
    "officialName": "Hợp chúng quốc Mexico",
    "nameEn": "Mexico",
    "officialNameEn": "United Mexican States",
    "flag": "🇲🇽",
    "capital": "Thành phố Mexico",
    "capitalEn": "Mexico City",
    "continent": "north_america",
    "region": "Bắc Mỹ",
    "subRegion": "Mesoamerica",
    "languages": [
      "es"
    ],
    "currency": "Peso",
    "neighbors": [
      "us",
      "gt",
      "bz"
    ],
    "geo": "coastal",
    "landscape": "temperate",
    "flagColors": [
      "green",
      "white",
      "red"
    ],
    "altCities": [
      "Guadalajara",
      "Monterrey",
      "Cancún",
      "Puebla"
    ],
    "facts": [
      {
        "id": "mx-geography-continent",
        "category": "geography",
        "vi": "Mexico nằm ở Bắc Mỹ.",
        "en": "Mexico is in North America.",
        "question": "Mexico nằm ở châu lục nào?",
        "answers": [
          "Bắc Mỹ",
          "Nam Mỹ",
          "Châu Âu",
          "Châu Á"
        ]
      },
      {
        "id": "mx-capital-mexico-city",
        "category": "capital",
        "vi": "Thủ đô của Mexico là Thành phố Mexico.",
        "en": "The capital of Mexico is Mexico City.",
        "question": "Thủ đô của Mexico là thành phố nào?",
        "answers": [
          "Thành phố Mexico",
          "Guadalajara",
          "Monterrey",
          "Cancún"
        ]
      },
      {
        "id": "mx-geography-coast",
        "category": "geography",
        "vi": "Mexico giáp Thái Bình Dương.",
        "en": "Mexico borders the Thái Bình Dương.",
        "question": "Mexico giáp biển hoặc đại dương nào?",
        "answers": [
          "Thái Bình Dương",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "mx-food-taco",
        "category": "food",
        "vi": "Taco là món bánh Tortilla nổi tiếng của Mexico.",
        "en": "Tacos are a famous Mexican tortilla dish.",
        "question": "Món bánh cuốn nổi tiếng của Mexico là gì?",
        "answers": [
          "Taco",
          "Sushi",
          "Phở",
          "Pizza"
        ]
      },
      {
        "id": "mx-landmarks-chichen",
        "category": "landmarks",
        "vi": "Kim tự tháp Chichén Itzá là công trình đá của người Maya ở Mexico.",
        "en": "Chichén Itzá is a Maya stone pyramid in Mexico.",
        "question": "Kim tự tháp Maya nổi tiếng ở Mexico tên là gì?",
        "answers": [
          "Chichén Itzá",
          "Kim tự tháp Giza",
          "Taj Mahal",
          "Colosseum"
        ]
      }
    ]
  },
  {
    "id": "ni",
    "isoCode": "NI",
    "name": "Nicaragua",
    "officialName": "Cộng hòa Nicaragua",
    "nameEn": "Nicaragua",
    "officialNameEn": "Republic of Nicaragua",
    "flag": "🇳🇮",
    "capital": "Managua",
    "capitalEn": "Managua",
    "continent": "north_america",
    "region": "Trung Mỹ",
    "subRegion": "Eo đất Trung Mỹ",
    "languages": [
      "es"
    ],
    "currency": "Córdoba",
    "neighbors": [
      "hn",
      "cr"
    ],
    "geo": "coastal",
    "landscape": "tropical",
    "flagColors": [
      "blue",
      "white"
    ],
    "altCities": [
      "León",
      "Granada",
      "Estelí"
    ],
    "facts": [
      {
        "id": "ni-geography-continent",
        "category": "geography",
        "vi": "Nicaragua nằm ở Bắc Mỹ.",
        "en": "Nicaragua is in North America.",
        "question": "Nicaragua nằm ở châu lục nào?",
        "answers": [
          "Bắc Mỹ",
          "Nam Mỹ",
          "Châu Âu",
          "Châu Á"
        ]
      },
      {
        "id": "ni-capital-managua",
        "category": "capital",
        "vi": "Thủ đô của Nicaragua là Managua.",
        "en": "The capital of Nicaragua is Managua.",
        "question": "Thủ đô của Nicaragua là thành phố nào?",
        "answers": [
          "Managua",
          "León",
          "Granada",
          "Estelí"
        ]
      },
      {
        "id": "ni-geography-coast",
        "category": "geography",
        "vi": "Nicaragua giáp Biển Caribe.",
        "en": "Nicaragua borders the Biển Caribe.",
        "question": "Nicaragua giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Caribe",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "ni-nature-lakes",
        "category": "nature",
        "vi": "Nicaragua có những hồ lớn như Hồ Nicaragua.",
        "en": "Nicaragua has large lakes such as Lake Nicaragua.",
        "question": "Hồ lớn nổi tiếng ở Nicaragua tên là gì?",
        "answers": [
          "Hồ Nicaragua",
          "Hồ Baikal",
          "Hồ Victoria",
          "Biển Chết"
        ]
      }
    ]
  },
  {
    "id": "pa",
    "isoCode": "PA",
    "name": "Panama",
    "officialName": "Cộng hòa Panama",
    "nameEn": "Panama",
    "officialNameEn": "Republic of Panama",
    "flag": "🇵🇦",
    "capital": "Thành phố Panama",
    "capitalEn": "Panama City",
    "continent": "north_america",
    "region": "Trung Mỹ",
    "subRegion": "Eo đất Panama",
    "languages": [
      "es"
    ],
    "currency": "Balboa",
    "neighbors": [
      "cr",
      "co"
    ],
    "geo": "coastal",
    "landscape": "tropical",
    "flagColors": [
      "red",
      "white",
      "blue"
    ],
    "altCities": [
      "Colón",
      "David",
      "Santiago"
    ],
    "facts": [
      {
        "id": "pa-geography-continent",
        "category": "geography",
        "vi": "Panama nằm ở Bắc Mỹ.",
        "en": "Panama is in North America.",
        "question": "Panama nằm ở châu lục nào?",
        "answers": [
          "Bắc Mỹ",
          "Nam Mỹ",
          "Châu Âu",
          "Châu Á"
        ]
      },
      {
        "id": "pa-capital-panama-city",
        "category": "capital",
        "vi": "Thủ đô của Panama là Thành phố Panama.",
        "en": "The capital of Panama is Panama City.",
        "question": "Thủ đô của Panama là thành phố nào?",
        "answers": [
          "Thành phố Panama",
          "Colón",
          "David",
          "Santiago"
        ]
      },
      {
        "id": "pa-geography-coast",
        "category": "geography",
        "vi": "Panama giáp Biển Caribe.",
        "en": "Panama borders the Biển Caribe.",
        "question": "Panama giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Caribe",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "pa-landmarks-canal",
        "category": "landmarks",
        "vi": "Kênh đào Panama nối Thái Bình Dương với Đại Tây Dương.",
        "en": "The Panama Canal links the Pacific and Atlantic Oceans.",
        "question": "Kênh đào nổi tiếng ở Panama nối hai đại dương nào?",
        "answers": [
          "Thái Bình Dương và Đại Tây Dương",
          "Ấn Độ Dương và Bắc Băng Dương",
          "Biển Đỏ và Biển Đen",
          "Địa Trung Hải và Baltic"
        ]
      }
    ]
  },
  {
    "id": "kn",
    "isoCode": "KN",
    "name": "Saint Kitts và Nevis",
    "officialName": "Liên bang Saint Kitts và Nevis",
    "nameEn": "Saint Kitts and Nevis",
    "officialNameEn": "Federation of Saint Kitts and Nevis",
    "flag": "🇰🇳",
    "capital": "Basseterre",
    "capitalEn": "Basseterre",
    "continent": "north_america",
    "region": "Caribe",
    "subRegion": "Quần đảo Leeward",
    "languages": [
      "en"
    ],
    "currency": "Đô la Đông Caribe",
    "neighbors": [],
    "geo": "island",
    "landscape": "island",
    "flagColors": [
      "green",
      "yellow",
      "red",
      "black"
    ],
    "altCities": [
      "Charlestown",
      "Sandy Point"
    ],
    "facts": [
      {
        "id": "kn-geography-continent",
        "category": "geography",
        "vi": "Saint Kitts và Nevis nằm ở Bắc Mỹ.",
        "en": "Saint Kitts and Nevis is in North America.",
        "question": "Saint Kitts và Nevis nằm ở châu lục nào?",
        "answers": [
          "Bắc Mỹ",
          "Nam Mỹ",
          "Châu Âu",
          "Châu Á"
        ]
      },
      {
        "id": "kn-capital-basseterre",
        "category": "capital",
        "vi": "Thủ đô của Saint Kitts và Nevis là Basseterre.",
        "en": "The capital of Saint Kitts and Nevis is Basseterre.",
        "question": "Thủ đô của Saint Kitts và Nevis là thành phố nào?",
        "answers": [
          "Basseterre",
          "Charlestown",
          "Sandy Point",
          "Paris"
        ]
      },
      {
        "id": "kn-geography-island",
        "category": "geography",
        "vi": "Saint Kitts và Nevis là một quốc gia đảo.",
        "en": "Saint Kitts and Nevis is an island country.",
        "question": "Điều nào đúng về Saint Kitts và Nevis?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "kn-geography-islands",
        "category": "geography",
        "vi": "Saint Kitts và Nevis gồm hai đảo ở Caribe.",
        "en": "Saint Kitts and Nevis is made of two islands in the Caribbean.",
        "question": "Saint Kitts và Nevis gồm mấy đảo chính?",
        "answers": [
          "Hai đảo",
          "Mười đảo lớn",
          "Không có đảo",
          "Một lục địa"
        ]
      }
    ]
  },
  {
    "id": "lc",
    "isoCode": "LC",
    "name": "Saint Lucia",
    "officialName": "Saint Lucia",
    "nameEn": "Saint Lucia",
    "officialNameEn": "Saint Lucia",
    "flag": "🇱🇨",
    "capital": "Castries",
    "capitalEn": "Castries",
    "continent": "north_america",
    "region": "Caribe",
    "subRegion": "Quần đảo Windward",
    "languages": [
      "en"
    ],
    "currency": "Đô la Đông Caribe",
    "neighbors": [],
    "geo": "island",
    "landscape": "island",
    "flagColors": [
      "blue",
      "yellow",
      "black",
      "white"
    ],
    "altCities": [
      "Soufrière",
      "Vieux Fort"
    ],
    "facts": [
      {
        "id": "lc-geography-continent",
        "category": "geography",
        "vi": "Saint Lucia nằm ở Bắc Mỹ.",
        "en": "Saint Lucia is in North America.",
        "question": "Saint Lucia nằm ở châu lục nào?",
        "answers": [
          "Bắc Mỹ",
          "Nam Mỹ",
          "Châu Âu",
          "Châu Á"
        ]
      },
      {
        "id": "lc-capital-castries",
        "category": "capital",
        "vi": "Thủ đô của Saint Lucia là Castries.",
        "en": "The capital of Saint Lucia is Castries.",
        "question": "Thủ đô của Saint Lucia là thành phố nào?",
        "answers": [
          "Castries",
          "Soufrière",
          "Vieux Fort",
          "Paris"
        ]
      },
      {
        "id": "lc-geography-island",
        "category": "geography",
        "vi": "Saint Lucia là một quốc gia đảo.",
        "en": "Saint Lucia is an island country.",
        "question": "Điều nào đúng về Saint Lucia?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "lc-nature-pitons",
        "category": "nature",
        "vi": "Hai ngọn núi Pitons là biểu tượng của Saint Lucia.",
        "en": "The twin Piton mountains are a symbol of Saint Lucia.",
        "question": "Hai ngọn núi nổi tiếng của Saint Lucia tên là gì?",
        "answers": [
          "Pitons",
          "Alps",
          "Fuji",
          "Kilimanjaro"
        ]
      }
    ]
  },
  {
    "id": "vc",
    "isoCode": "VC",
    "name": "Saint Vincent và Grenadines",
    "officialName": "Saint Vincent và Grenadines",
    "nameEn": "Saint Vincent and the Grenadines",
    "officialNameEn": "Saint Vincent and the Grenadines",
    "flag": "🇻🇨",
    "capital": "Kingstown",
    "capitalEn": "Kingstown",
    "continent": "north_america",
    "region": "Caribe",
    "subRegion": "Quần đảo Windward",
    "languages": [
      "en"
    ],
    "currency": "Đô la Đông Caribe",
    "neighbors": [],
    "geo": "island",
    "landscape": "island",
    "flagColors": [
      "blue",
      "yellow",
      "green"
    ],
    "altCities": [
      "Georgetown",
      "Barrouallie"
    ],
    "facts": [
      {
        "id": "vc-geography-continent",
        "category": "geography",
        "vi": "Saint Vincent và Grenadines nằm ở Bắc Mỹ.",
        "en": "Saint Vincent and the Grenadines is in North America.",
        "question": "Saint Vincent và Grenadines nằm ở châu lục nào?",
        "answers": [
          "Bắc Mỹ",
          "Nam Mỹ",
          "Châu Âu",
          "Châu Á"
        ]
      },
      {
        "id": "vc-capital-kingstown",
        "category": "capital",
        "vi": "Thủ đô của Saint Vincent và Grenadines là Kingstown.",
        "en": "The capital of Saint Vincent and the Grenadines is Kingstown.",
        "question": "Thủ đô của Saint Vincent và Grenadines là thành phố nào?",
        "answers": [
          "Kingstown",
          "Georgetown",
          "Barrouallie",
          "Paris"
        ]
      },
      {
        "id": "vc-geography-island",
        "category": "geography",
        "vi": "Saint Vincent và Grenadines là một quốc gia đảo.",
        "en": "Saint Vincent and the Grenadines is an island country.",
        "question": "Điều nào đúng về Saint Vincent và Grenadines?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "vc-geography-islands",
        "category": "geography",
        "vi": "Saint Vincent và Grenadines gồm nhiều đảo nhỏ ở Caribe.",
        "en": "Saint Vincent and the Grenadines is made of many small Caribbean islands.",
        "question": "Saint Vincent và Grenadines nằm ở vùng nào?",
        "answers": [
          "Caribe",
          "Bắc Âu",
          "Sa mạc Sahara",
          "Himalaya"
        ]
      }
    ]
  },
  {
    "id": "tt",
    "isoCode": "TT",
    "name": "Trinidad và Tobago",
    "officialName": "Cộng hòa Trinidad và Tobago",
    "nameEn": "Trinidad and Tobago",
    "officialNameEn": "Republic of Trinidad and Tobago",
    "flag": "🇹🇹",
    "capital": "Port of Spain",
    "capitalEn": "Port of Spain",
    "continent": "north_america",
    "region": "Caribe",
    "subRegion": "Antilles nhỏ",
    "languages": [
      "en"
    ],
    "currency": "Đô la Trinidad",
    "neighbors": [],
    "geo": "island",
    "landscape": "tropical",
    "flagColors": [
      "red",
      "white",
      "black"
    ],
    "altCities": [
      "San Fernando",
      "Chaguanas",
      "Scarborough"
    ],
    "facts": [
      {
        "id": "tt-geography-continent",
        "category": "geography",
        "vi": "Trinidad và Tobago nằm ở Bắc Mỹ.",
        "en": "Trinidad and Tobago is in North America.",
        "question": "Trinidad và Tobago nằm ở châu lục nào?",
        "answers": [
          "Bắc Mỹ",
          "Nam Mỹ",
          "Châu Âu",
          "Châu Á"
        ]
      },
      {
        "id": "tt-capital-port-of-spain",
        "category": "capital",
        "vi": "Thủ đô của Trinidad và Tobago là Port of Spain.",
        "en": "The capital of Trinidad and Tobago is Port of Spain.",
        "question": "Thủ đô của Trinidad và Tobago là thành phố nào?",
        "answers": [
          "Port of Spain",
          "San Fernando",
          "Chaguanas",
          "Scarborough"
        ]
      },
      {
        "id": "tt-geography-island",
        "category": "geography",
        "vi": "Trinidad và Tobago là một quốc gia đảo.",
        "en": "Trinidad and Tobago is an island country.",
        "question": "Điều nào đúng về Trinidad và Tobago?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "tt-geography-islands",
        "category": "geography",
        "vi": "Trinidad và Tobago gồm hai đảo chính gần Nam Mỹ.",
        "en": "Trinidad and Tobago is made of two main islands near South America.",
        "question": "Trinidad và Tobago gồm mấy đảo chính?",
        "answers": [
          "Hai đảo chính",
          "Một đảo duy nhất",
          "Hai mươi đảo lớn",
          "Không có đảo"
        ]
      }
    ]
  },
  {
    "id": "us",
    "isoCode": "US",
    "name": "Mỹ",
    "officialName": "Hợp chúng quốc Hoa Kỳ",
    "nameEn": "United States",
    "officialNameEn": "United States of America",
    "flag": "🇺🇸",
    "capital": "Washington",
    "capitalEn": "Washington",
    "continent": "north_america",
    "region": "Bắc Mỹ",
    "subRegion": "Bắc Mỹ",
    "languages": [
      "en"
    ],
    "currency": "Đô la Mỹ",
    "neighbors": [
      "ca",
      "mx"
    ],
    "geo": "coastal",
    "landscape": "temperate",
    "flagColors": [
      "red",
      "white",
      "blue"
    ],
    "altCities": [
      "New York",
      "Los Angeles",
      "Chicago",
      "San Francisco"
    ],
    "facts": [
      {
        "id": "us-geography-continent",
        "category": "geography",
        "vi": "Mỹ nằm ở Bắc Mỹ.",
        "en": "United States is in North America.",
        "question": "Mỹ nằm ở châu lục nào?",
        "answers": [
          "Bắc Mỹ",
          "Nam Mỹ",
          "Châu Âu",
          "Châu Á"
        ]
      },
      {
        "id": "us-capital-washington",
        "category": "capital",
        "vi": "Thủ đô của Mỹ là Washington.",
        "en": "The capital of United States is Washington.",
        "question": "Thủ đô của Mỹ là thành phố nào?",
        "answers": [
          "Washington",
          "New York",
          "Los Angeles",
          "Chicago"
        ]
      },
      {
        "id": "us-geography-coast",
        "category": "geography",
        "vi": "Mỹ giáp Đại Tây Dương.",
        "en": "United States borders the Đại Tây Dương.",
        "question": "Mỹ giáp biển hoặc đại dương nào?",
        "answers": [
          "Đại Tây Dương",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "us-landmarks-liberty",
        "category": "landmarks",
        "vi": "Tượng Nữ thần Tự do đứng trên một hòn đảo ở New York.",
        "en": "The Statue of Liberty stands on an island in New York.",
        "question": "Bức tượng nổi tiếng ở New York tên là gì?",
        "answers": [
          "Tượng Nữ thần Tự do",
          "Tháp Eiffel",
          "Big Ben",
          "Kim tự tháp"
        ]
      },
      {
        "id": "us-nature-canyon",
        "category": "nature",
        "vi": "Hẻm núi Grand Canyon nằm ở nước Mỹ.",
        "en": "The Grand Canyon is in the United States.",
        "question": "Hẻm núi rất lớn ở Mỹ tên là gì?",
        "answers": [
          "Grand Canyon",
          "Hẻm núi Alps",
          "Vịnh Hạ Long",
          "Fjord Na Uy"
        ]
      }
    ]
  },
  {
    "id": "ar",
    "isoCode": "AR",
    "name": "Argentina",
    "officialName": "Cộng hòa Argentina",
    "nameEn": "Argentina",
    "officialNameEn": "Argentine Republic",
    "flag": "🇦🇷",
    "capital": "Buenos Aires",
    "capitalEn": "Buenos Aires",
    "continent": "south_america",
    "region": "Nam Mỹ",
    "subRegion": "Nam Cone",
    "languages": [
      "es"
    ],
    "currency": "Peso",
    "neighbors": [
      "cl",
      "bo",
      "py",
      "br",
      "uy"
    ],
    "geo": "coastal",
    "landscape": "temperate",
    "flagColors": [
      "blue",
      "white"
    ],
    "altCities": [
      "Córdoba",
      "Rosario",
      "Mendoza",
      "Bariloche"
    ],
    "facts": [
      {
        "id": "ar-geography-continent",
        "category": "geography",
        "vi": "Argentina nằm ở Nam Mỹ.",
        "en": "Argentina is in South America.",
        "question": "Argentina nằm ở châu lục nào?",
        "answers": [
          "Nam Mỹ",
          "Bắc Mỹ",
          "Châu Phi",
          "Châu Âu"
        ]
      },
      {
        "id": "ar-capital-buenos-aires",
        "category": "capital",
        "vi": "Thủ đô của Argentina là Buenos Aires.",
        "en": "The capital of Argentina is Buenos Aires.",
        "question": "Thủ đô của Argentina là thành phố nào?",
        "answers": [
          "Buenos Aires",
          "Córdoba",
          "Rosario",
          "Mendoza"
        ]
      },
      {
        "id": "ar-geography-coast",
        "category": "geography",
        "vi": "Argentina giáp Đại Tây Dương.",
        "en": "Argentina borders the Đại Tây Dương.",
        "question": "Argentina giáp biển hoặc đại dương nào?",
        "answers": [
          "Đại Tây Dương",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "ar-nature-andes",
        "category": "nature",
        "vi": "Dãy Andes chạy dọc biên giới phía tây Argentina.",
        "en": "The Andes run along Argentina's western border.",
        "question": "Dãy núi dài ở phía tây Argentina tên là gì?",
        "answers": [
          "Andes",
          "Alps",
          "Himalaya",
          "Atlas"
        ]
      }
    ]
  },
  {
    "id": "bo",
    "isoCode": "BO",
    "name": "Bolivia",
    "officialName": "Nhà nước Đa quốc gia Bolivia",
    "nameEn": "Bolivia",
    "officialNameEn": "Plurinational State of Bolivia",
    "flag": "🇧🇴",
    "capital": "La Paz",
    "capitalEn": "La Paz",
    "continent": "south_america",
    "region": "Nam Mỹ",
    "subRegion": "Altiplano",
    "languages": [
      "es"
    ],
    "currency": "Boliviano",
    "neighbors": [
      "pe",
      "br",
      "py",
      "ar",
      "cl"
    ],
    "geo": "landlocked",
    "landscape": "mountain",
    "flagColors": [
      "red",
      "yellow",
      "green"
    ],
    "altCities": [
      "Sucre",
      "Santa Cruz",
      "Cochabamba"
    ],
    "facts": [
      {
        "id": "bo-geography-continent",
        "category": "geography",
        "vi": "Bolivia nằm ở Nam Mỹ.",
        "en": "Bolivia is in South America.",
        "question": "Bolivia nằm ở châu lục nào?",
        "answers": [
          "Nam Mỹ",
          "Bắc Mỹ",
          "Châu Phi",
          "Châu Âu"
        ]
      },
      {
        "id": "bo-capital-la-paz",
        "category": "capital",
        "vi": "Thủ đô của Bolivia là La Paz.",
        "en": "The capital of Bolivia is La Paz.",
        "question": "Thủ đô của Bolivia là thành phố nào?",
        "answers": [
          "La Paz",
          "Sucre",
          "Santa Cruz",
          "Cochabamba"
        ]
      },
      {
        "id": "bo-geography-landlocked",
        "category": "geography",
        "vi": "Bolivia không giáp biển.",
        "en": "Bolivia is landlocked.",
        "question": "Điều nào đúng về Bolivia?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "bo-nature-uyuni",
        "category": "nature",
        "vi": "Cánh đồng muối Uyuni ở Bolivia giống như tấm gương khi có nước.",
        "en": "The Uyuni salt flat in Bolivia looks like a mirror when wet.",
        "question": "Cánh đồng muối nổi tiếng ở Bolivia tên là gì?",
        "answers": [
          "Uyuni",
          "Sahara",
          "Gobi",
          "Namib"
        ]
      }
    ]
  },
  {
    "id": "br",
    "isoCode": "BR",
    "name": "Brazil",
    "officialName": "Cộng hòa Liên bang Brazil",
    "nameEn": "Brazil",
    "officialNameEn": "Federative Republic of Brazil",
    "flag": "🇧🇷",
    "capital": "Brasília",
    "capitalEn": "Brasília",
    "continent": "south_america",
    "region": "Nam Mỹ",
    "subRegion": "Lưu vực Amazon",
    "languages": [
      "pt"
    ],
    "currency": "Real",
    "neighbors": [
      "uy",
      "ar",
      "py",
      "bo",
      "pe",
      "co",
      "ve",
      "gy",
      "sr"
    ],
    "geo": "coastal",
    "landscape": "rainforest",
    "flagColors": [
      "green",
      "yellow",
      "blue"
    ],
    "altCities": [
      "Rio de Janeiro",
      "São Paulo",
      "Salvador",
      "Manaus"
    ],
    "facts": [
      {
        "id": "br-geography-continent",
        "category": "geography",
        "vi": "Brazil nằm ở Nam Mỹ.",
        "en": "Brazil is in South America.",
        "question": "Brazil nằm ở châu lục nào?",
        "answers": [
          "Nam Mỹ",
          "Bắc Mỹ",
          "Châu Phi",
          "Châu Âu"
        ]
      },
      {
        "id": "br-capital-brasília",
        "category": "capital",
        "vi": "Thủ đô của Brazil là Brasília.",
        "en": "The capital of Brazil is Brasília.",
        "question": "Thủ đô của Brazil là thành phố nào?",
        "answers": [
          "Brasília",
          "Rio de Janeiro",
          "São Paulo",
          "Salvador"
        ]
      },
      {
        "id": "br-geography-coast",
        "category": "geography",
        "vi": "Brazil giáp Đại Tây Dương.",
        "en": "Brazil borders the Đại Tây Dương.",
        "question": "Brazil giáp biển hoặc đại dương nào?",
        "answers": [
          "Đại Tây Dương",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "br-nature-amazon",
        "category": "nature",
        "vi": "Rừng Amazon, khu rừng mưa rất lớn, nằm phần lớn ở Brazil.",
        "en": "The Amazon rainforest, a very large rainforest, is mostly in Brazil.",
        "question": "Khu rừng mưa rất lớn ở Brazil tên là gì?",
        "answers": [
          "Amazon",
          "Congo",
          "Taiga",
          "Gobi"
        ]
      },
      {
        "id": "br-landmarks-christ",
        "category": "landmarks",
        "vi": "Tượng Chúa Kitô Cứu Thế đứng trên núi nhìn ra Rio de Janeiro.",
        "en": "Christ the Redeemer stands on a mountain above Rio de Janeiro.",
        "question": "Bức tượng lớn trên núi ở Rio de Janeiro tên là gì?",
        "answers": [
          "Tượng Chúa Kitô Cứu Thế",
          "Tượng Nữ thần Tự do",
          "Tháp Eiffel",
          "Kim tự tháp"
        ]
      }
    ]
  },
  {
    "id": "cl",
    "isoCode": "CL",
    "name": "Chile",
    "officialName": "Cộng hòa Chile",
    "nameEn": "Chile",
    "officialNameEn": "Republic of Chile",
    "flag": "🇨🇱",
    "capital": "Santiago",
    "capitalEn": "Santiago",
    "continent": "south_america",
    "region": "Nam Mỹ",
    "subRegion": "Andes",
    "languages": [
      "es"
    ],
    "currency": "Peso",
    "neighbors": [
      "pe",
      "bo",
      "ar"
    ],
    "geo": "coastal",
    "landscape": "mountain",
    "flagColors": [
      "red",
      "white",
      "blue"
    ],
    "altCities": [
      "Valparaíso",
      "Concepción",
      "Punta Arenas"
    ],
    "facts": [
      {
        "id": "cl-geography-continent",
        "category": "geography",
        "vi": "Chile nằm ở Nam Mỹ.",
        "en": "Chile is in South America.",
        "question": "Chile nằm ở châu lục nào?",
        "answers": [
          "Nam Mỹ",
          "Bắc Mỹ",
          "Châu Phi",
          "Châu Âu"
        ]
      },
      {
        "id": "cl-capital-santiago",
        "category": "capital",
        "vi": "Thủ đô của Chile là Santiago.",
        "en": "The capital of Chile is Santiago.",
        "question": "Thủ đô của Chile là thành phố nào?",
        "answers": [
          "Santiago",
          "Valparaíso",
          "Concepción",
          "Punta Arenas"
        ]
      },
      {
        "id": "cl-geography-coast",
        "category": "geography",
        "vi": "Chile giáp Thái Bình Dương.",
        "en": "Chile borders the Thái Bình Dương.",
        "question": "Chile giáp biển hoặc đại dương nào?",
        "answers": [
          "Thái Bình Dương",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "cl-geography-thin",
        "category": "geography",
        "vi": "Chile là quốc gia rất dài và hẹp dọc bờ Thái Bình Dương.",
        "en": "Chile is a very long, narrow country along the Pacific coast.",
        "question": "Chile có hình dạng nổi bật nào?",
        "answers": [
          "Dài và hẹp",
          "Tròn như đảo san hô",
          "Vuông như bàn cờ",
          "Không có bờ biển"
        ]
      }
    ]
  },
  {
    "id": "co",
    "isoCode": "CO",
    "name": "Colombia",
    "officialName": "Cộng hòa Colombia",
    "nameEn": "Colombia",
    "officialNameEn": "Republic of Colombia",
    "flag": "🇨🇴",
    "capital": "Bogotá",
    "capitalEn": "Bogotá",
    "continent": "south_america",
    "region": "Nam Mỹ",
    "subRegion": "Andes",
    "languages": [
      "es"
    ],
    "currency": "Peso",
    "neighbors": [
      "pa",
      "ve",
      "br",
      "ec",
      "pe"
    ],
    "geo": "coastal",
    "landscape": "tropical",
    "flagColors": [
      "yellow",
      "blue",
      "red"
    ],
    "altCities": [
      "Medellín",
      "Cali",
      "Cartagena",
      "Barranquilla"
    ],
    "facts": [
      {
        "id": "co-geography-continent",
        "category": "geography",
        "vi": "Colombia nằm ở Nam Mỹ.",
        "en": "Colombia is in South America.",
        "question": "Colombia nằm ở châu lục nào?",
        "answers": [
          "Nam Mỹ",
          "Bắc Mỹ",
          "Châu Phi",
          "Châu Âu"
        ]
      },
      {
        "id": "co-capital-bogotá",
        "category": "capital",
        "vi": "Thủ đô của Colombia là Bogotá.",
        "en": "The capital of Colombia is Bogotá.",
        "question": "Thủ đô của Colombia là thành phố nào?",
        "answers": [
          "Bogotá",
          "Medellín",
          "Cali",
          "Cartagena"
        ]
      },
      {
        "id": "co-geography-coast",
        "category": "geography",
        "vi": "Colombia giáp Biển Caribe.",
        "en": "Colombia borders the Biển Caribe.",
        "question": "Colombia giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Caribe",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "co-food-coffee",
        "category": "food",
        "vi": "Colombia nổi tiếng với cà phê trồng trên núi.",
        "en": "Colombia is famous for mountain-grown coffee.",
        "question": "Colombia nổi tiếng trồng cây gì trên núi?",
        "answers": [
          "Cà phê",
          "Lúa mì",
          "Xương rồng",
          "Táo"
        ]
      }
    ]
  },
  {
    "id": "ec",
    "isoCode": "EC",
    "name": "Ecuador",
    "officialName": "Cộng hòa Ecuador",
    "nameEn": "Ecuador",
    "officialNameEn": "Republic of Ecuador",
    "flag": "🇪🇨",
    "capital": "Quito",
    "capitalEn": "Quito",
    "continent": "south_america",
    "region": "Nam Mỹ",
    "subRegion": "Andes",
    "languages": [
      "es"
    ],
    "currency": "Đô la Mỹ",
    "neighbors": [
      "co",
      "pe"
    ],
    "geo": "coastal",
    "landscape": "mountain",
    "flagColors": [
      "yellow",
      "blue",
      "red"
    ],
    "altCities": [
      "Guayaquil",
      "Cuenca",
      "Ambato"
    ],
    "facts": [
      {
        "id": "ec-geography-continent",
        "category": "geography",
        "vi": "Ecuador nằm ở Nam Mỹ.",
        "en": "Ecuador is in South America.",
        "question": "Ecuador nằm ở châu lục nào?",
        "answers": [
          "Nam Mỹ",
          "Bắc Mỹ",
          "Châu Phi",
          "Châu Âu"
        ]
      },
      {
        "id": "ec-capital-quito",
        "category": "capital",
        "vi": "Thủ đô của Ecuador là Quito.",
        "en": "The capital of Ecuador is Quito.",
        "question": "Thủ đô của Ecuador là thành phố nào?",
        "answers": [
          "Quito",
          "Guayaquil",
          "Cuenca",
          "Ambato"
        ]
      },
      {
        "id": "ec-geography-coast",
        "category": "geography",
        "vi": "Ecuador giáp Thái Bình Dương.",
        "en": "Ecuador borders the Thái Bình Dương.",
        "question": "Ecuador giáp biển hoặc đại dương nào?",
        "answers": [
          "Thái Bình Dương",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "ec-animals-galapagos",
        "category": "animals",
        "vi": "Quần đảo Galápagos của Ecuador có rùa khổng lồ.",
        "en": "Ecuador's Galápagos Islands are home to giant tortoises.",
        "question": "Quần đảo nổi tiếng của Ecuador có rùa khổng lồ tên là gì?",
        "answers": [
          "Galápagos",
          "Hawaii",
          "Maldives",
          "Sicily"
        ]
      }
    ]
  },
  {
    "id": "gy",
    "isoCode": "GY",
    "name": "Guyana",
    "officialName": "Cộng hòa Hợp tác Guyana",
    "nameEn": "Guyana",
    "officialNameEn": "Co-operative Republic of Guyana",
    "flag": "🇬🇾",
    "capital": "Georgetown",
    "capitalEn": "Georgetown",
    "continent": "south_america",
    "region": "Nam Mỹ",
    "subRegion": "Cao nguyên Guyana",
    "languages": [
      "en"
    ],
    "currency": "Đô la Guyana",
    "neighbors": [
      "ve",
      "br",
      "sr"
    ],
    "geo": "coastal",
    "landscape": "rainforest",
    "flagColors": [
      "green",
      "yellow",
      "red"
    ],
    "altCities": [
      "Linden",
      "New Amsterdam"
    ],
    "facts": [
      {
        "id": "gy-geography-continent",
        "category": "geography",
        "vi": "Guyana nằm ở Nam Mỹ.",
        "en": "Guyana is in South America.",
        "question": "Guyana nằm ở châu lục nào?",
        "answers": [
          "Nam Mỹ",
          "Bắc Mỹ",
          "Châu Phi",
          "Châu Âu"
        ]
      },
      {
        "id": "gy-capital-georgetown",
        "category": "capital",
        "vi": "Thủ đô của Guyana là Georgetown.",
        "en": "The capital of Guyana is Georgetown.",
        "question": "Thủ đô của Guyana là thành phố nào?",
        "answers": [
          "Georgetown",
          "Linden",
          "New Amsterdam",
          "Paris"
        ]
      },
      {
        "id": "gy-geography-coast",
        "category": "geography",
        "vi": "Guyana giáp Đại Tây Dương.",
        "en": "Guyana borders the Đại Tây Dương.",
        "question": "Guyana giáp biển hoặc đại dương nào?",
        "answers": [
          "Đại Tây Dương",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "gy-nature-rainforest",
        "category": "nature",
        "vi": "Guyana có nhiều rừng mưa nhiệt đới.",
        "en": "Guyana has a lot of tropical rainforest.",
        "question": "Guyana nổi tiếng với kiểu rừng nào?",
        "answers": [
          "Rừng mưa nhiệt đới",
          "Rừng thông Bắc Cực",
          "Rừng xương rồng",
          "Rừng bạch dương"
        ]
      }
    ]
  },
  {
    "id": "py",
    "isoCode": "PY",
    "name": "Paraguay",
    "officialName": "Cộng hòa Paraguay",
    "nameEn": "Paraguay",
    "officialNameEn": "Republic of Paraguay",
    "flag": "🇵🇾",
    "capital": "Asunción",
    "capitalEn": "Asunción",
    "continent": "south_america",
    "region": "Nam Mỹ",
    "subRegion": "Lưu vực Paraná",
    "languages": [
      "es"
    ],
    "currency": "Guaraní",
    "neighbors": [
      "bo",
      "br",
      "ar"
    ],
    "geo": "landlocked",
    "landscape": "temperate",
    "flagColors": [
      "red",
      "white",
      "blue"
    ],
    "altCities": [
      "Ciudad del Este",
      "Encarnación"
    ],
    "facts": [
      {
        "id": "py-geography-continent",
        "category": "geography",
        "vi": "Paraguay nằm ở Nam Mỹ.",
        "en": "Paraguay is in South America.",
        "question": "Paraguay nằm ở châu lục nào?",
        "answers": [
          "Nam Mỹ",
          "Bắc Mỹ",
          "Châu Phi",
          "Châu Âu"
        ]
      },
      {
        "id": "py-capital-asunción",
        "category": "capital",
        "vi": "Thủ đô của Paraguay là Asunción.",
        "en": "The capital of Paraguay is Asunción.",
        "question": "Thủ đô của Paraguay là thành phố nào?",
        "answers": [
          "Asunción",
          "Ciudad del Este",
          "Encarnación",
          "Paris"
        ]
      },
      {
        "id": "py-geography-landlocked",
        "category": "geography",
        "vi": "Paraguay không giáp biển.",
        "en": "Paraguay is landlocked.",
        "question": "Điều nào đúng về Paraguay?",
        "answers": [
          "Không giáp biển",
          "Là quốc gia đảo",
          "Nằm dưới mực nước biển",
          "Không có thủ đô"
        ]
      },
      {
        "id": "py-language-es",
        "category": "language",
        "vi": "Người dân Paraguay nói tiếng Tây Ban Nha.",
        "en": "People in Paraguay speak tiếng Tây Ban Nha.",
        "question": "Người dân Paraguay nói ngôn ngữ nào?",
        "answers": [
          "tiếng Tây Ban Nha",
          "tiếng Việt",
          "tiếng Nhật",
          "tiếng Inuit"
        ]
      }
    ]
  },
  {
    "id": "pe",
    "isoCode": "PE",
    "name": "Peru",
    "officialName": "Cộng hòa Peru",
    "nameEn": "Peru",
    "officialNameEn": "Republic of Peru",
    "flag": "🇵🇪",
    "capital": "Lima",
    "capitalEn": "Lima",
    "continent": "south_america",
    "region": "Nam Mỹ",
    "subRegion": "Andes",
    "languages": [
      "es"
    ],
    "currency": "Sol",
    "neighbors": [
      "ec",
      "co",
      "br",
      "bo",
      "cl"
    ],
    "geo": "coastal",
    "landscape": "mountain",
    "flagColors": [
      "red",
      "white"
    ],
    "altCities": [
      "Cusco",
      "Arequipa",
      "Trujillo",
      "Iquitos"
    ],
    "facts": [
      {
        "id": "pe-geography-continent",
        "category": "geography",
        "vi": "Peru nằm ở Nam Mỹ.",
        "en": "Peru is in South America.",
        "question": "Peru nằm ở châu lục nào?",
        "answers": [
          "Nam Mỹ",
          "Bắc Mỹ",
          "Châu Phi",
          "Châu Âu"
        ]
      },
      {
        "id": "pe-capital-lima",
        "category": "capital",
        "vi": "Thủ đô của Peru là Lima.",
        "en": "The capital of Peru is Lima.",
        "question": "Thủ đô của Peru là thành phố nào?",
        "answers": [
          "Lima",
          "Cusco",
          "Arequipa",
          "Trujillo"
        ]
      },
      {
        "id": "pe-geography-coast",
        "category": "geography",
        "vi": "Peru giáp Thái Bình Dương.",
        "en": "Peru borders the Thái Bình Dương.",
        "question": "Peru giáp biển hoặc đại dương nào?",
        "answers": [
          "Thái Bình Dương",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "pe-landmarks-machu",
        "category": "landmarks",
        "vi": "Machu Picchu là thành phố đá cổ trên núi ở Peru.",
        "en": "Machu Picchu is an ancient stone city in the mountains of Peru.",
        "question": "Thành phố đá cổ trên núi ở Peru tên là gì?",
        "answers": [
          "Machu Picchu",
          "Petra",
          "Angkor Wat",
          "Colosseum"
        ]
      }
    ]
  },
  {
    "id": "sr",
    "isoCode": "SR",
    "name": "Suriname",
    "officialName": "Cộng hòa Suriname",
    "nameEn": "Suriname",
    "officialNameEn": "Republic of Suriname",
    "flag": "🇸🇷",
    "capital": "Paramaribo",
    "capitalEn": "Paramaribo",
    "continent": "south_america",
    "region": "Nam Mỹ",
    "subRegion": "Cao nguyên Guyana",
    "languages": [
      "nl"
    ],
    "currency": "Đô la Suriname",
    "neighbors": [
      "gy",
      "br"
    ],
    "geo": "coastal",
    "landscape": "rainforest",
    "flagColors": [
      "green",
      "white",
      "red",
      "yellow"
    ],
    "altCities": [
      "Nieuw Nickerie",
      "Lelydorp"
    ],
    "facts": [
      {
        "id": "sr-geography-continent",
        "category": "geography",
        "vi": "Suriname nằm ở Nam Mỹ.",
        "en": "Suriname is in South America.",
        "question": "Suriname nằm ở châu lục nào?",
        "answers": [
          "Nam Mỹ",
          "Bắc Mỹ",
          "Châu Phi",
          "Châu Âu"
        ]
      },
      {
        "id": "sr-capital-paramaribo",
        "category": "capital",
        "vi": "Thủ đô của Suriname là Paramaribo.",
        "en": "The capital of Suriname is Paramaribo.",
        "question": "Thủ đô của Suriname là thành phố nào?",
        "answers": [
          "Paramaribo",
          "Nieuw Nickerie",
          "Lelydorp",
          "Paris"
        ]
      },
      {
        "id": "sr-geography-coast",
        "category": "geography",
        "vi": "Suriname giáp Đại Tây Dương.",
        "en": "Suriname borders the Đại Tây Dương.",
        "question": "Suriname giáp biển hoặc đại dương nào?",
        "answers": [
          "Đại Tây Dương",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "sr-language-dutch",
        "category": "language",
        "vi": "Suriname là quốc gia ở Nam Mỹ nói tiếng Hà Lan.",
        "en": "Suriname is a South American country where Dutch is spoken.",
        "question": "Người dân Suriname nói ngôn ngữ chính nào?",
        "answers": [
          "Tiếng Hà Lan",
          "Tiếng Tây Ban Nha",
          "Tiếng Bồ Đào Nha",
          "Tiếng Pháp"
        ]
      }
    ]
  },
  {
    "id": "uy",
    "isoCode": "UY",
    "name": "Uruguay",
    "officialName": "Cộng hòa Đông Uruguay",
    "nameEn": "Uruguay",
    "officialNameEn": "Oriental Republic of Uruguay",
    "flag": "🇺🇾",
    "capital": "Montevideo",
    "capitalEn": "Montevideo",
    "continent": "south_america",
    "region": "Nam Mỹ",
    "subRegion": "Nam Cone",
    "languages": [
      "es"
    ],
    "currency": "Peso",
    "neighbors": [
      "ar",
      "br"
    ],
    "geo": "coastal",
    "landscape": "temperate",
    "flagColors": [
      "blue",
      "white"
    ],
    "altCities": [
      "Punta del Este",
      "Salto",
      "Paysandú"
    ],
    "facts": [
      {
        "id": "uy-geography-continent",
        "category": "geography",
        "vi": "Uruguay nằm ở Nam Mỹ.",
        "en": "Uruguay is in South America.",
        "question": "Uruguay nằm ở châu lục nào?",
        "answers": [
          "Nam Mỹ",
          "Bắc Mỹ",
          "Châu Phi",
          "Châu Âu"
        ]
      },
      {
        "id": "uy-capital-montevideo",
        "category": "capital",
        "vi": "Thủ đô của Uruguay là Montevideo.",
        "en": "The capital of Uruguay is Montevideo.",
        "question": "Thủ đô của Uruguay là thành phố nào?",
        "answers": [
          "Montevideo",
          "Punta del Este",
          "Salto",
          "Paysandú"
        ]
      },
      {
        "id": "uy-geography-coast",
        "category": "geography",
        "vi": "Uruguay giáp Đại Tây Dương.",
        "en": "Uruguay borders the Đại Tây Dương.",
        "question": "Uruguay giáp biển hoặc đại dương nào?",
        "answers": [
          "Đại Tây Dương",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "uy-language-es",
        "category": "language",
        "vi": "Người dân Uruguay nói tiếng Tây Ban Nha.",
        "en": "People in Uruguay speak tiếng Tây Ban Nha.",
        "question": "Người dân Uruguay nói ngôn ngữ nào?",
        "answers": [
          "tiếng Tây Ban Nha",
          "tiếng Việt",
          "tiếng Nhật",
          "tiếng Inuit"
        ]
      }
    ]
  },
  {
    "id": "ve",
    "isoCode": "VE",
    "name": "Venezuela",
    "officialName": "Cộng hòa Bolivar Venezuela",
    "nameEn": "Venezuela",
    "officialNameEn": "Bolivarian Republic of Venezuela",
    "flag": "🇻🇪",
    "capital": "Caracas",
    "capitalEn": "Caracas",
    "continent": "south_america",
    "region": "Nam Mỹ",
    "subRegion": "Andes – Caribe",
    "languages": [
      "es"
    ],
    "currency": "Bolívar",
    "neighbors": [
      "co",
      "br",
      "gy"
    ],
    "geo": "coastal",
    "landscape": "tropical",
    "flagColors": [
      "yellow",
      "blue",
      "red"
    ],
    "altCities": [
      "Maracaibo",
      "Valencia",
      "Mérida"
    ],
    "facts": [
      {
        "id": "ve-geography-continent",
        "category": "geography",
        "vi": "Venezuela nằm ở Nam Mỹ.",
        "en": "Venezuela is in South America.",
        "question": "Venezuela nằm ở châu lục nào?",
        "answers": [
          "Nam Mỹ",
          "Bắc Mỹ",
          "Châu Phi",
          "Châu Âu"
        ]
      },
      {
        "id": "ve-capital-caracas",
        "category": "capital",
        "vi": "Thủ đô của Venezuela là Caracas.",
        "en": "The capital of Venezuela is Caracas.",
        "question": "Thủ đô của Venezuela là thành phố nào?",
        "answers": [
          "Caracas",
          "Maracaibo",
          "Valencia",
          "Mérida"
        ]
      },
      {
        "id": "ve-geography-coast",
        "category": "geography",
        "vi": "Venezuela giáp Biển Caribe.",
        "en": "Venezuela borders the Biển Caribe.",
        "question": "Venezuela giáp biển hoặc đại dương nào?",
        "answers": [
          "Biển Caribe",
          "Bắc Băng Dương",
          "Biển Caspi",
          "Hồ Baikal"
        ]
      },
      {
        "id": "ve-nature-angel",
        "category": "nature",
        "vi": "Thác Angel ở Venezuela là thác nước cao nhất thế giới.",
        "en": "Angel Falls in Venezuela is the world's highest waterfall.",
        "question": "Thác nước cao nhất thế giới ở Venezuela tên là gì?",
        "answers": [
          "Thác Angel",
          "Thác Niagara",
          "Thác Victoria",
          "Thác Iguazu"
        ]
      }
    ]
  },
  {
    "id": "au",
    "isoCode": "AU",
    "name": "Úc",
    "officialName": "Thịnh vượng chung Úc",
    "nameEn": "Australia",
    "officialNameEn": "Commonwealth of Australia",
    "flag": "🇦🇺",
    "capital": "Canberra",
    "capitalEn": "Canberra",
    "continent": "oceania",
    "region": "Úc và New Zealand",
    "subRegion": "Lục địa Úc",
    "languages": [
      "en"
    ],
    "currency": "Đô la Úc",
    "neighbors": [],
    "geo": "island",
    "landscape": "desert",
    "flagColors": [
      "blue",
      "red",
      "white"
    ],
    "altCities": [
      "Sydney",
      "Melbourne",
      "Brisbane",
      "Perth"
    ],
    "facts": [
      {
        "id": "au-geography-continent",
        "category": "geography",
        "vi": "Úc nằm ở Châu Đại Dương.",
        "en": "Australia is in Oceania.",
        "question": "Úc nằm ở châu lục nào?",
        "answers": [
          "Châu Đại Dương",
          "Châu Á",
          "Châu Phi",
          "Châu Âu"
        ]
      },
      {
        "id": "au-capital-canberra",
        "category": "capital",
        "vi": "Thủ đô của Úc là Canberra.",
        "en": "The capital of Australia is Canberra.",
        "question": "Thủ đô của Úc là thành phố nào?",
        "answers": [
          "Canberra",
          "Sydney",
          "Melbourne",
          "Brisbane"
        ]
      },
      {
        "id": "au-geography-island",
        "category": "geography",
        "vi": "Úc là một quốc gia đảo.",
        "en": "Australia is an island country.",
        "question": "Điều nào đúng về Úc?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "au-animals-kangaroo",
        "category": "animals",
        "vi": "Kanguru sống tự nhiên ở Úc.",
        "en": "Kangaroos live in the wild in Australia.",
        "question": "Con vật nhảy bằng hai chân sau sống ở Úc là gì?",
        "answers": [
          "Kanguru",
          "Gấu trúc",
          "Lạc đà",
          "Sư tử"
        ]
      },
      {
        "id": "au-nature-reef",
        "category": "nature",
        "vi": "Rạn san hô Great Barrier Reef nằm ngoài khơi Úc.",
        "en": "The Great Barrier Reef lies off the coast of Australia.",
        "question": "Rạn san hô rất lớn ngoài khơi Úc tên là gì?",
        "answers": [
          "Great Barrier Reef",
          "Tam giác san hô Maldives",
          "Biển Đỏ",
          "Biển Baltic"
        ]
      }
    ]
  },
  {
    "id": "fj",
    "isoCode": "FJ",
    "name": "Fiji",
    "officialName": "Cộng hòa Fiji",
    "nameEn": "Fiji",
    "officialNameEn": "Republic of Fiji",
    "flag": "🇫🇯",
    "capital": "Suva",
    "capitalEn": "Suva",
    "continent": "oceania",
    "region": "Melanesia",
    "subRegion": "Quần đảo Fiji",
    "languages": [
      "en"
    ],
    "currency": "Đô la Fiji",
    "neighbors": [],
    "geo": "island",
    "landscape": "island",
    "flagColors": [
      "blue",
      "red",
      "white"
    ],
    "altCities": [
      "Nadi",
      "Lautoka"
    ],
    "facts": [
      {
        "id": "fj-geography-continent",
        "category": "geography",
        "vi": "Fiji nằm ở Châu Đại Dương.",
        "en": "Fiji is in Oceania.",
        "question": "Fiji nằm ở châu lục nào?",
        "answers": [
          "Châu Đại Dương",
          "Châu Á",
          "Châu Phi",
          "Châu Âu"
        ]
      },
      {
        "id": "fj-capital-suva",
        "category": "capital",
        "vi": "Thủ đô của Fiji là Suva.",
        "en": "The capital of Fiji is Suva.",
        "question": "Thủ đô của Fiji là thành phố nào?",
        "answers": [
          "Suva",
          "Nadi",
          "Lautoka",
          "Paris"
        ]
      },
      {
        "id": "fj-geography-island",
        "category": "geography",
        "vi": "Fiji là một quốc gia đảo.",
        "en": "Fiji is an island country.",
        "question": "Điều nào đúng về Fiji?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "fj-geography-islands",
        "category": "geography",
        "vi": "Fiji là quốc gia gồm hơn 300 hòn đảo trên Thái Bình Dương.",
        "en": "Fiji is a country of more than 300 islands in the Pacific.",
        "question": "Fiji gồm rất nhiều thứ gì?",
        "answers": [
          "Hòn đảo",
          "Sa mạc",
          "Sông băng",
          "Thành phố lớn"
        ]
      }
    ]
  },
  {
    "id": "ki",
    "isoCode": "KI",
    "name": "Kiribati",
    "officialName": "Cộng hòa Kiribati",
    "nameEn": "Kiribati",
    "officialNameEn": "Republic of Kiribati",
    "flag": "🇰🇮",
    "capital": "South Tarawa",
    "capitalEn": "South Tarawa",
    "continent": "oceania",
    "region": "Micronesia",
    "subRegion": "Quần đảo Gilbert",
    "languages": [
      "en"
    ],
    "currency": "Đô la Úc",
    "neighbors": [],
    "geo": "island",
    "landscape": "island",
    "flagColors": [
      "red",
      "white",
      "blue"
    ],
    "altCities": [
      "Betio",
      "Bairiki"
    ],
    "facts": [
      {
        "id": "ki-geography-continent",
        "category": "geography",
        "vi": "Kiribati nằm ở Châu Đại Dương.",
        "en": "Kiribati is in Oceania.",
        "question": "Kiribati nằm ở châu lục nào?",
        "answers": [
          "Châu Đại Dương",
          "Châu Á",
          "Châu Phi",
          "Châu Âu"
        ]
      },
      {
        "id": "ki-capital-south-tarawa",
        "category": "capital",
        "vi": "Thủ đô của Kiribati là South Tarawa.",
        "en": "The capital of Kiribati is South Tarawa.",
        "question": "Thủ đô của Kiribati là thành phố nào?",
        "answers": [
          "South Tarawa",
          "Betio",
          "Bairiki",
          "Paris"
        ]
      },
      {
        "id": "ki-geography-island",
        "category": "geography",
        "vi": "Kiribati là một quốc gia đảo.",
        "en": "Kiribati is an island country.",
        "question": "Điều nào đúng về Kiribati?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "ki-geography-equator",
        "category": "geography",
        "vi": "Kiribati có các đảo nằm cả hai bên đường xích đạo.",
        "en": "Kiribati has islands on both sides of the equator.",
        "question": "Kiribati nổi tiếng vì các đảo nằm gần đường nào?",
        "answers": [
          "Đường xích đạo",
          "Cực Bắc",
          "Cực Nam",
          "Dãy Alps"
        ]
      }
    ]
  },
  {
    "id": "mh",
    "isoCode": "MH",
    "name": "Quần đảo Marshall",
    "officialName": "Cộng hòa Quần đảo Marshall",
    "nameEn": "Marshall Islands",
    "officialNameEn": "Republic of the Marshall Islands",
    "flag": "🇲🇭",
    "capital": "Majuro",
    "capitalEn": "Majuro",
    "continent": "oceania",
    "region": "Micronesia",
    "subRegion": "Quần đảo Marshall",
    "languages": [
      "en"
    ],
    "currency": "Đô la Mỹ",
    "neighbors": [],
    "geo": "island",
    "landscape": "island",
    "flagColors": [
      "blue",
      "white",
      "orange"
    ],
    "altCities": [
      "Ebeye",
      "Jaluit"
    ],
    "facts": [
      {
        "id": "mh-geography-continent",
        "category": "geography",
        "vi": "Quần đảo Marshall nằm ở Châu Đại Dương.",
        "en": "Marshall Islands is in Oceania.",
        "question": "Quần đảo Marshall nằm ở châu lục nào?",
        "answers": [
          "Châu Đại Dương",
          "Châu Á",
          "Châu Phi",
          "Châu Âu"
        ]
      },
      {
        "id": "mh-capital-majuro",
        "category": "capital",
        "vi": "Thủ đô của Quần đảo Marshall là Majuro.",
        "en": "The capital of Marshall Islands is Majuro.",
        "question": "Thủ đô của Quần đảo Marshall là thành phố nào?",
        "answers": [
          "Majuro",
          "Ebeye",
          "Jaluit",
          "Paris"
        ]
      },
      {
        "id": "mh-geography-island",
        "category": "geography",
        "vi": "Quần đảo Marshall là một quốc gia đảo.",
        "en": "Marshall Islands is an island country.",
        "question": "Điều nào đúng về Quần đảo Marshall?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "mh-geography-atolls",
        "category": "geography",
        "vi": "Quần đảo Marshall gồm nhiều đảo san hô vòng trên Thái Bình Dương.",
        "en": "The Marshall Islands are made of coral atolls in the Pacific.",
        "question": "Quần đảo Marshall gồm loại đảo nào?",
        "answers": [
          "Đảo san hô vòng",
          "Núi Himalaya",
          "Sa mạc Sahara",
          "Sông băng"
        ]
      }
    ]
  },
  {
    "id": "fm",
    "isoCode": "FM",
    "name": "Micronesia",
    "officialName": "Liên bang Micronesia",
    "nameEn": "Micronesia",
    "officialNameEn": "Federated States of Micronesia",
    "flag": "🇫🇲",
    "capital": "Palikir",
    "capitalEn": "Palikir",
    "continent": "oceania",
    "region": "Micronesia",
    "subRegion": "Quần đảo Caroline",
    "languages": [
      "en"
    ],
    "currency": "Đô la Mỹ",
    "neighbors": [],
    "geo": "island",
    "landscape": "island",
    "flagColors": [
      "blue",
      "white"
    ],
    "altCities": [
      "Kolonia",
      "Weno",
      "Colonia"
    ],
    "facts": [
      {
        "id": "fm-geography-continent",
        "category": "geography",
        "vi": "Micronesia nằm ở Châu Đại Dương.",
        "en": "Micronesia is in Oceania.",
        "question": "Micronesia nằm ở châu lục nào?",
        "answers": [
          "Châu Đại Dương",
          "Châu Á",
          "Châu Phi",
          "Châu Âu"
        ]
      },
      {
        "id": "fm-capital-palikir",
        "category": "capital",
        "vi": "Thủ đô của Micronesia là Palikir.",
        "en": "The capital of Micronesia is Palikir.",
        "question": "Thủ đô của Micronesia là thành phố nào?",
        "answers": [
          "Palikir",
          "Kolonia",
          "Weno",
          "Colonia"
        ]
      },
      {
        "id": "fm-geography-island",
        "category": "geography",
        "vi": "Micronesia là một quốc gia đảo.",
        "en": "Micronesia is an island country.",
        "question": "Điều nào đúng về Micronesia?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "fm-geography-islands",
        "category": "geography",
        "vi": "Micronesia gồm nhiều đảo nhỏ trên Thái Bình Dương.",
        "en": "Micronesia is made of many small islands in the Pacific Ocean.",
        "question": "Micronesia nằm trên đại dương nào?",
        "answers": [
          "Thái Bình Dương",
          "Đại Tây Dương",
          "Ấn Độ Dương",
          "Bắc Băng Dương"
        ]
      }
    ]
  },
  {
    "id": "nr",
    "isoCode": "NR",
    "name": "Nauru",
    "officialName": "Cộng hòa Nauru",
    "nameEn": "Nauru",
    "officialNameEn": "Republic of Nauru",
    "flag": "🇳🇷",
    "capital": "Yaren",
    "capitalEn": "Yaren",
    "continent": "oceania",
    "region": "Micronesia",
    "subRegion": "Đảo Nauru",
    "languages": [
      "en"
    ],
    "currency": "Đô la Úc",
    "neighbors": [],
    "geo": "island",
    "landscape": "island",
    "flagColors": [
      "blue",
      "yellow",
      "white"
    ],
    "altCities": [
      "Aiwo",
      "Denigomodu"
    ],
    "facts": [
      {
        "id": "nr-geography-continent",
        "category": "geography",
        "vi": "Nauru nằm ở Châu Đại Dương.",
        "en": "Nauru is in Oceania.",
        "question": "Nauru nằm ở châu lục nào?",
        "answers": [
          "Châu Đại Dương",
          "Châu Á",
          "Châu Phi",
          "Châu Âu"
        ]
      },
      {
        "id": "nr-capital-yaren",
        "category": "capital",
        "vi": "Thủ đô của Nauru là Yaren.",
        "en": "The capital of Nauru is Yaren.",
        "question": "Thủ đô của Nauru là thành phố nào?",
        "answers": [
          "Yaren",
          "Aiwo",
          "Denigomodu",
          "Paris"
        ]
      },
      {
        "id": "nr-geography-island",
        "category": "geography",
        "vi": "Nauru là một quốc gia đảo.",
        "en": "Nauru is an island country.",
        "question": "Điều nào đúng về Nauru?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "nr-geography-tiny",
        "category": "geography",
        "vi": "Nauru là một trong những quốc gia đảo nhỏ nhất thế giới.",
        "en": "Nauru is one of the world's smallest island countries.",
        "question": "Nauru thuộc loại quốc gia nào?",
        "answers": [
          "Quốc gia đảo rất nhỏ",
          "Quốc gia không giáp biển",
          "Quốc gia lớn nhất châu Đại Dương",
          "Quốc gia ở châu Âu"
        ]
      }
    ]
  },
  {
    "id": "nz",
    "isoCode": "NZ",
    "name": "New Zealand",
    "officialName": "New Zealand",
    "nameEn": "New Zealand",
    "officialNameEn": "New Zealand",
    "flag": "🇳🇿",
    "capital": "Wellington",
    "capitalEn": "Wellington",
    "continent": "oceania",
    "region": "Úc và New Zealand",
    "subRegion": "Quần đảo New Zealand",
    "languages": [
      "en"
    ],
    "currency": "Đô la New Zealand",
    "neighbors": [],
    "geo": "island",
    "landscape": "temperate",
    "flagColors": [
      "blue",
      "red",
      "white"
    ],
    "altCities": [
      "Auckland",
      "Christchurch",
      "Queenstown",
      "Hamilton"
    ],
    "facts": [
      {
        "id": "nz-geography-continent",
        "category": "geography",
        "vi": "New Zealand nằm ở Châu Đại Dương.",
        "en": "New Zealand is in Oceania.",
        "question": "New Zealand nằm ở châu lục nào?",
        "answers": [
          "Châu Đại Dương",
          "Châu Á",
          "Châu Phi",
          "Châu Âu"
        ]
      },
      {
        "id": "nz-capital-wellington",
        "category": "capital",
        "vi": "Thủ đô của New Zealand là Wellington.",
        "en": "The capital of New Zealand is Wellington.",
        "question": "Thủ đô của New Zealand là thành phố nào?",
        "answers": [
          "Wellington",
          "Auckland",
          "Christchurch",
          "Queenstown"
        ]
      },
      {
        "id": "nz-geography-island",
        "category": "geography",
        "vi": "New Zealand là một quốc gia đảo.",
        "en": "New Zealand is an island country.",
        "question": "Điều nào đúng về New Zealand?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "nz-animals-kiwi",
        "category": "animals",
        "vi": "Chim kiwi không biết bay sống ở New Zealand.",
        "en": "The flightless kiwi bird lives in New Zealand.",
        "question": "Loài chim không biết bay nổi tiếng của New Zealand là gì?",
        "answers": [
          "Kiwi",
          "Đại bàng",
          "Chim cánh cụt hoàng đế",
          "Vẹt ara"
        ]
      }
    ]
  },
  {
    "id": "pw",
    "isoCode": "PW",
    "name": "Palau",
    "officialName": "Cộng hòa Palau",
    "nameEn": "Palau",
    "officialNameEn": "Republic of Palau",
    "flag": "🇵🇼",
    "capital": "Ngerulmud",
    "capitalEn": "Ngerulmud",
    "continent": "oceania",
    "region": "Micronesia",
    "subRegion": "Quần đảo Caroline",
    "languages": [
      "en"
    ],
    "currency": "Đô la Mỹ",
    "neighbors": [],
    "geo": "island",
    "landscape": "island",
    "flagColors": [
      "blue",
      "yellow"
    ],
    "altCities": [
      "Koror",
      "Melekeok"
    ],
    "facts": [
      {
        "id": "pw-geography-continent",
        "category": "geography",
        "vi": "Palau nằm ở Châu Đại Dương.",
        "en": "Palau is in Oceania.",
        "question": "Palau nằm ở châu lục nào?",
        "answers": [
          "Châu Đại Dương",
          "Châu Á",
          "Châu Phi",
          "Châu Âu"
        ]
      },
      {
        "id": "pw-capital-ngerulmud",
        "category": "capital",
        "vi": "Thủ đô của Palau là Ngerulmud.",
        "en": "The capital of Palau is Ngerulmud.",
        "question": "Thủ đô của Palau là thành phố nào?",
        "answers": [
          "Ngerulmud",
          "Koror",
          "Melekeok",
          "Paris"
        ]
      },
      {
        "id": "pw-geography-island",
        "category": "geography",
        "vi": "Palau là một quốc gia đảo.",
        "en": "Palau is an island country.",
        "question": "Điều nào đúng về Palau?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "pw-nature-rockislands",
        "category": "nature",
        "vi": "Palau có những đảo đá vôi xanh trên biển trong vắt.",
        "en": "Palau has green limestone islands in very clear water.",
        "question": "Palau nổi tiếng với cảnh gì?",
        "answers": [
          "Đảo đá và biển trong",
          "Sa mạc cát",
          "Sông băng",
          "Rừng thông Bắc Cực"
        ]
      }
    ]
  },
  {
    "id": "pg",
    "isoCode": "PG",
    "name": "Papua New Guinea",
    "officialName": "Nhà nước Độc lập Papua New Guinea",
    "nameEn": "Papua New Guinea",
    "officialNameEn": "Independent State of Papua New Guinea",
    "flag": "🇵🇬",
    "capital": "Port Moresby",
    "capitalEn": "Port Moresby",
    "continent": "oceania",
    "region": "Melanesia",
    "subRegion": "Đảo New Guinea",
    "languages": [
      "en"
    ],
    "currency": "Kina",
    "neighbors": [
      "id"
    ],
    "geo": "island",
    "landscape": "rainforest",
    "flagColors": [
      "red",
      "black",
      "yellow"
    ],
    "altCities": [
      "Lae",
      "Mount Hagen",
      "Madang"
    ],
    "facts": [
      {
        "id": "pg-geography-continent",
        "category": "geography",
        "vi": "Papua New Guinea nằm ở Châu Đại Dương.",
        "en": "Papua New Guinea is in Oceania.",
        "question": "Papua New Guinea nằm ở châu lục nào?",
        "answers": [
          "Châu Đại Dương",
          "Châu Á",
          "Châu Phi",
          "Châu Âu"
        ]
      },
      {
        "id": "pg-capital-port-moresby",
        "category": "capital",
        "vi": "Thủ đô của Papua New Guinea là Port Moresby.",
        "en": "The capital of Papua New Guinea is Port Moresby.",
        "question": "Thủ đô của Papua New Guinea là thành phố nào?",
        "answers": [
          "Port Moresby",
          "Lae",
          "Mount Hagen",
          "Madang"
        ]
      },
      {
        "id": "pg-geography-island",
        "category": "geography",
        "vi": "Papua New Guinea là một quốc gia đảo.",
        "en": "Papua New Guinea is an island country.",
        "question": "Điều nào đúng về Papua New Guinea?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "pg-animals-bird",
        "category": "animals",
        "vi": "Chim thiên đường sống trong rừng Papua New Guinea.",
        "en": "Birds of paradise live in the forests of Papua New Guinea.",
        "question": "Loài chim nhiều màu sống ở Papua New Guinea tên là gì?",
        "answers": [
          "Chim thiên đường",
          "Đại bàng",
          "Chim cánh cụt",
          "Gà tây"
        ]
      }
    ]
  },
  {
    "id": "ws",
    "isoCode": "WS",
    "name": "Samoa",
    "officialName": "Nhà nước Độc lập Samoa",
    "nameEn": "Samoa",
    "officialNameEn": "Independent State of Samoa",
    "flag": "🇼🇸",
    "capital": "Apia",
    "capitalEn": "Apia",
    "continent": "oceania",
    "region": "Polynesia",
    "subRegion": "Quần đảo Samoa",
    "languages": [
      "sm",
      "en"
    ],
    "currency": "Tala",
    "neighbors": [],
    "geo": "island",
    "landscape": "island",
    "flagColors": [
      "red",
      "blue",
      "white"
    ],
    "altCities": [
      "Vaitele",
      "Faleula"
    ],
    "facts": [
      {
        "id": "ws-geography-continent",
        "category": "geography",
        "vi": "Samoa nằm ở Châu Đại Dương.",
        "en": "Samoa is in Oceania.",
        "question": "Samoa nằm ở châu lục nào?",
        "answers": [
          "Châu Đại Dương",
          "Châu Á",
          "Châu Phi",
          "Châu Âu"
        ]
      },
      {
        "id": "ws-capital-apia",
        "category": "capital",
        "vi": "Thủ đô của Samoa là Apia.",
        "en": "The capital of Samoa is Apia.",
        "question": "Thủ đô của Samoa là thành phố nào?",
        "answers": [
          "Apia",
          "Vaitele",
          "Faleula",
          "Paris"
        ]
      },
      {
        "id": "ws-geography-island",
        "category": "geography",
        "vi": "Samoa là một quốc gia đảo.",
        "en": "Samoa is an island country.",
        "question": "Điều nào đúng về Samoa?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "ws-geography-islands",
        "category": "geography",
        "vi": "Samoa là quốc gia đảo trên Thái Bình Dương.",
        "en": "Samoa is an island country in the Pacific Ocean.",
        "question": "Samoa nằm trên đại dương nào?",
        "answers": [
          "Thái Bình Dương",
          "Đại Tây Dương",
          "Ấn Độ Dương",
          "Bắc Băng Dương"
        ]
      }
    ]
  },
  {
    "id": "sb",
    "isoCode": "SB",
    "name": "Quần đảo Solomon",
    "officialName": "Quần đảo Solomon",
    "nameEn": "Solomon Islands",
    "officialNameEn": "Solomon Islands",
    "flag": "🇸🇧",
    "capital": "Honiara",
    "capitalEn": "Honiara",
    "continent": "oceania",
    "region": "Melanesia",
    "subRegion": "Quần đảo Solomon",
    "languages": [
      "en"
    ],
    "currency": "Đô la Solomon",
    "neighbors": [],
    "geo": "island",
    "landscape": "rainforest",
    "flagColors": [
      "blue",
      "green",
      "yellow",
      "white"
    ],
    "altCities": [
      "Gizo",
      "Auki"
    ],
    "facts": [
      {
        "id": "sb-geography-continent",
        "category": "geography",
        "vi": "Quần đảo Solomon nằm ở Châu Đại Dương.",
        "en": "Solomon Islands is in Oceania.",
        "question": "Quần đảo Solomon nằm ở châu lục nào?",
        "answers": [
          "Châu Đại Dương",
          "Châu Á",
          "Châu Phi",
          "Châu Âu"
        ]
      },
      {
        "id": "sb-capital-honiara",
        "category": "capital",
        "vi": "Thủ đô của Quần đảo Solomon là Honiara.",
        "en": "The capital of Solomon Islands is Honiara.",
        "question": "Thủ đô của Quần đảo Solomon là thành phố nào?",
        "answers": [
          "Honiara",
          "Gizo",
          "Auki",
          "Paris"
        ]
      },
      {
        "id": "sb-geography-island",
        "category": "geography",
        "vi": "Quần đảo Solomon là một quốc gia đảo.",
        "en": "Solomon Islands is an island country.",
        "question": "Điều nào đúng về Quần đảo Solomon?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "sb-geography-islands",
        "category": "geography",
        "vi": "Quần đảo Solomon gồm nhiều đảo rừng ở Melanesia.",
        "en": "The Solomon Islands are forested islands in Melanesia.",
        "question": "Quần đảo Solomon nằm ở vùng nào?",
        "answers": [
          "Melanesia",
          "Bắc Âu",
          "Sa mạc Sahara",
          "Himalaya"
        ]
      }
    ]
  },
  {
    "id": "to",
    "isoCode": "TO",
    "name": "Tonga",
    "officialName": "Vương quốc Tonga",
    "nameEn": "Tonga",
    "officialNameEn": "Kingdom of Tonga",
    "flag": "🇹🇴",
    "capital": "Nuku'alofa",
    "capitalEn": "Nuku'alofa",
    "continent": "oceania",
    "region": "Polynesia",
    "subRegion": "Quần đảo Tonga",
    "languages": [
      "to",
      "en"
    ],
    "currency": "Paʻanga",
    "neighbors": [],
    "geo": "island",
    "landscape": "island",
    "flagColors": [
      "red",
      "white"
    ],
    "altCities": [
      "Neiafu",
      "Pangai"
    ],
    "facts": [
      {
        "id": "to-geography-continent",
        "category": "geography",
        "vi": "Tonga nằm ở Châu Đại Dương.",
        "en": "Tonga is in Oceania.",
        "question": "Tonga nằm ở châu lục nào?",
        "answers": [
          "Châu Đại Dương",
          "Châu Á",
          "Châu Phi",
          "Châu Âu"
        ]
      },
      {
        "id": "to-capital-nuku-alofa",
        "category": "capital",
        "vi": "Thủ đô của Tonga là Nuku'alofa.",
        "en": "The capital of Tonga is Nuku'alofa.",
        "question": "Thủ đô của Tonga là thành phố nào?",
        "answers": [
          "Nuku'alofa",
          "Neiafu",
          "Pangai",
          "Paris"
        ]
      },
      {
        "id": "to-geography-island",
        "category": "geography",
        "vi": "Tonga là một quốc gia đảo.",
        "en": "Tonga is an island country.",
        "question": "Điều nào đúng về Tonga?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "to-geography-islands",
        "category": "geography",
        "vi": "Tonga là vương quốc đảo trên Thái Bình Dương.",
        "en": "Tonga is an island kingdom in the Pacific Ocean.",
        "question": "Tonga nằm trên đại dương nào?",
        "answers": [
          "Thái Bình Dương",
          "Đại Tây Dương",
          "Ấn Độ Dương",
          "Biển Baltic"
        ]
      }
    ]
  },
  {
    "id": "tv",
    "isoCode": "TV",
    "name": "Tuvalu",
    "officialName": "Tuvalu",
    "nameEn": "Tuvalu",
    "officialNameEn": "Tuvalu",
    "flag": "🇹🇻",
    "capital": "Funafuti",
    "capitalEn": "Funafuti",
    "continent": "oceania",
    "region": "Polynesia",
    "subRegion": "Quần đảo Tuvalu",
    "languages": [
      "en"
    ],
    "currency": "Đô la Úc",
    "neighbors": [],
    "geo": "island",
    "landscape": "island",
    "flagColors": [
      "blue",
      "yellow"
    ],
    "altCities": [
      "Fongafale",
      "Vaiaku"
    ],
    "facts": [
      {
        "id": "tv-geography-continent",
        "category": "geography",
        "vi": "Tuvalu nằm ở Châu Đại Dương.",
        "en": "Tuvalu is in Oceania.",
        "question": "Tuvalu nằm ở châu lục nào?",
        "answers": [
          "Châu Đại Dương",
          "Châu Á",
          "Châu Phi",
          "Châu Âu"
        ]
      },
      {
        "id": "tv-capital-funafuti",
        "category": "capital",
        "vi": "Thủ đô của Tuvalu là Funafuti.",
        "en": "The capital of Tuvalu is Funafuti.",
        "question": "Thủ đô của Tuvalu là thành phố nào?",
        "answers": [
          "Funafuti",
          "Fongafale",
          "Vaiaku",
          "Paris"
        ]
      },
      {
        "id": "tv-geography-island",
        "category": "geography",
        "vi": "Tuvalu là một quốc gia đảo.",
        "en": "Tuvalu is an island country.",
        "question": "Điều nào đúng về Tuvalu?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "tv-geography-atolls",
        "category": "geography",
        "vi": "Tuvalu gồm các đảo san hô thấp trên Thái Bình Dương.",
        "en": "Tuvalu is made of low coral atolls in the Pacific.",
        "question": "Tuvalu gồm loại đảo nào?",
        "answers": [
          "Đảo san hô thấp",
          "Núi cao Himalaya",
          "Sa mạc Sahara",
          "Sông băng"
        ]
      }
    ]
  },
  {
    "id": "vu",
    "isoCode": "VU",
    "name": "Vanuatu",
    "officialName": "Cộng hòa Vanuatu",
    "nameEn": "Vanuatu",
    "officialNameEn": "Republic of Vanuatu",
    "flag": "🇻🇺",
    "capital": "Port Vila",
    "capitalEn": "Port Vila",
    "continent": "oceania",
    "region": "Melanesia",
    "subRegion": "Quần đảo Vanuatu",
    "languages": [
      "en",
      "fr"
    ],
    "currency": "Vatu",
    "neighbors": [],
    "geo": "island",
    "landscape": "island",
    "flagColors": [
      "red",
      "green",
      "black",
      "yellow"
    ],
    "altCities": [
      "Luganville",
      "Isangel"
    ],
    "facts": [
      {
        "id": "vu-geography-continent",
        "category": "geography",
        "vi": "Vanuatu nằm ở Châu Đại Dương.",
        "en": "Vanuatu is in Oceania.",
        "question": "Vanuatu nằm ở châu lục nào?",
        "answers": [
          "Châu Đại Dương",
          "Châu Á",
          "Châu Phi",
          "Châu Âu"
        ]
      },
      {
        "id": "vu-capital-port-vila",
        "category": "capital",
        "vi": "Thủ đô của Vanuatu là Port Vila.",
        "en": "The capital of Vanuatu is Port Vila.",
        "question": "Thủ đô của Vanuatu là thành phố nào?",
        "answers": [
          "Port Vila",
          "Luganville",
          "Isangel",
          "Paris"
        ]
      },
      {
        "id": "vu-geography-island",
        "category": "geography",
        "vi": "Vanuatu là một quốc gia đảo.",
        "en": "Vanuatu is an island country.",
        "question": "Điều nào đúng về Vanuatu?",
        "answers": [
          "Là quốc gia đảo",
          "Không giáp biển",
          "Nằm giữa sa mạc Sahara",
          "Không có thủ đô"
        ]
      },
      {
        "id": "vu-nature-volcano",
        "category": "nature",
        "vi": "Vanuatu có núi lửa còn hoạt động trên một số đảo.",
        "en": "Vanuatu has active volcanoes on some islands.",
        "question": "Vanuatu nổi tiếng với dạng núi nào?",
        "answers": [
          "Núi lửa",
          "Núi băng vĩnh cửu",
          "Núi muối",
          "Núi cát Sahara"
        ]
      }
    ]
  }
];
  const INDEX = {};
  COUNTRIES.forEach((c) => { INDEX[c.id] = c; });
  function all() { return COUNTRIES.slice(); }
  function byId(id) { return INDEX[id] || null; }
  return { all, byId, TOTAL: COUNTRIES.length, CONTINENTS };
})();
if (typeof module !== 'undefined') module.exports = { WorldExplorerLib };
