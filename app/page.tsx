"use client";

import { useState } from "react";

export default function Home() {
  const [openDetails, setOpenDetails] = useState<Record<string, boolean>>({});
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [hasSahibindenListing, setHasSahibindenListing] = useState<boolean | null>(null);
  const [listingNumber, setListingNumber] = useState("");
  const [acceptedCommission, setAcceptedCommission] = useState(false);
  

  const toggleDetail = (id: string) => {
    setOpenDetails(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Tüm Türkiye şehirleri - özel sıralama
  const cities = [
    "İstanbul (Avrupa)", "İstanbul (Anadolu)", "Ankara", "İzmir", "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Antalya", "Artvin",
    "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale",
    "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum",
    "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkâri", "Hatay", "Isparta", "Mersin",
    "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli",
    "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş",
    "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas",
    "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak",
    "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan",
    "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
  ];

  // İlçeler - tüm Türkiye ilçeleri
  const getDistricts = (city: string) => {
    const districts: Record<string, string[]> = {
      "Adana": ["Seyhan", "Yüreğir", "Çukurova", "Sarıçam", "İmamoğlu", "Aladağ", "Yumurtalık", "Tufanbeyli", "Saimbeyli", "Pozantı", "Kozan", "Karataş", "Karaisalı", "Feke", "Ceyhan"],
      "Adıyaman": ["Merkez", "Besni", "Çelikhan", "Gerger", "Gölbaşı", "Kahta", "Samsat", "Sincik", "Tut"],
      "Afyonkarahisar": ["Merkez", "Başmakçı", "Bayat", "Bolvadin", "Çay", "Çobanlar", "Dazkırı", "Dinar", "Emirdağ", "Evciler", "Hocalar", "İhsaniye", "İscehisar", "Kızılören", "Sandıklı", "Sinanpaşa", "Sultandağı", "Şuhut"],
      "Ağrı": ["Merkez", "Diyadin", "Doğubayazıt", "Eleşkirt", "Hamur", "Patnos", "Taşlıçay", "Tutak"],
      "Amasya": ["Merkez", "Göynücek", "Gümüşhacıköy", "Hamamözü", "Merzifon", "Suluova", "Taşova"],
      "Ankara": ["Altındağ", "Ayaş", "Bala", "Beypazarı", "Çamlıdere", "Çankaya", "Çubuk", "Elmadağ", "Etimesgut", "Evren", "Gölbaşı", "Güdül", "Haymana", "Kalecik", "Kazan", "Keçiören", "Kızılcahamam", "Mamak", "Nallıhan", "Polatlı", "Pursaklar", "Sincan", "Şereflikoçhisar", "Yenimahalle"],
      "Antalya": ["Akseki", "Aksu", "Alanya", "Demre", "Döşemealtı", "Elmalı", "Finike", "Gazipaşa", "Gündoğmuş", "İbradı", "Kaş", "Kemer", "Kepez", "Konyaaltı", "Korkuteli", "Kumluca", "Manavgat", "Muratpaşa", "Serik"],
      "Artvin": ["Ardanuç", "Arhavi", "Borçka", "Hopa", "Merkez", "Murgul", "Şavşat", "Yusufeli"],
      "Aydın": ["Bozdoğan", "Buharkent", "Çine", "Didim", "Efeler", "Germencik", "İncirliova", "Karacasu", "Karpuzlu", "Koçarlı", "Köşk", "Kuşadası", "Kuyucak", "Nazilli", "Söke", "Sultanhisar", "Yenipazar"],
      "Balıkesir": ["Altıeylül", "Ayvalık", "Balya", "Bandırma", "Bigadiç", "Burhaniye", "Dursunbey", "Edremit", "Erdek", "Gömeç", "Gönen", "Havran", "İvrindi", "Karesi", "Kepsut", "Manyas", "Marmara", "Savaştepe", "Sındırgı", "Susurluk"],
      "Bilecik": ["Bozüyük", "Gölpazarı", "İnhisar", "Merkez", "Osmaneli", "Pazaryeri", "Söğüt", "Yenipazar"],
      "Bingöl": ["Adaklı", "Genç", "Karlıova", "Kiğı", "Merkez", "Solhan", "Yayladere", "Yedisu"],
      "Bitlis": ["Adilcevaz", "Ahlat", "Güroymak", "Hizan", "Merkez", "Mutki", "Tatvan"],
      "Bolu": ["Dörtdivan", "Gerede", "Göynük", "Kıbrıscık", "Mengen", "Merkez", "Mudurnu", "Seben", "Yeniçağa"],
      "Burdur": ["Ağlasun", "Altınyayla", "Bucak", "Çavdır", "Çeltikçi", "Gölhisar", "Karamanlı", "Kemer", "Merkez", "Tefenni", "Yeşilova"],
      "Bursa": ["Büyükorhan", "Gemlik", "Gürsu", "Harmancık", "İnegöl", "İznik", "Karacabey", "Keles", "Kestel", "Mudanya", "Mustafakemalpaşa", "Nilüfer", "Orhaneli", "Orhangazi", "Osmangazi", "Yenişehir", "Yıldırım"],
      "Çanakkale": ["Ayvacık", "Bayramiç", "Biga", "Bozcaada", "Çan", "Eceabat", "Ezine", "Gelibolu", "Gökçeada", "Lapseki", "Merkez", "Yenice"],
      "Çankırı": ["Atkaracalar", "Bayramören", "Çerkeş", "Eldivan", "Ilgaz", "Kızılırmak", "Korgun", "Kurşunlu", "Merkez", "Orta", "Şabanözü", "Yapraklı"],
      "Çorum": ["Alaca", "Bayat", "Boğazkale", "Dodurga", "İskilip", "Kargı", "Laçin", "Mecitözü", "Merkez", "Oğuzlar", "Ortaköy", "Osmancık", "Sungurlu", "Uğurludağ"],
      "Denizli": ["Acıpayam", "Babadağ", "Baklan", "Bekilli", "Beyağaç", "Bozkurt", "Buldan", "Çal", "Çameli", "Çardak", "Çivril", "Güney", "Honaz", "Kale", "Merkez", "Merkezefendi", "Pamukkale", "Sarayköy", "Serinhisar", "Tavas"],
      "Diyarbakır": ["Bağlar", "Bismil", "Çermik", "Çınar", "Çüngüş", "Dicle", "Eğil", "Ergani", "Hani", "Hazro", "Kayapınar", "Kocaköy", "Kulp", "Lice", "Merkez", "Silvan", "Sur", "Yenişehir"],
      "Edirne": ["Enez", "Havsa", "İpsala", "Keşan", "Lalapaşa", "Merkez", "Meriç", "Süloğlu", "Uzunköprü"],
      "Elazığ": ["Ağın", "Alacakaya", "Arıcak", "Baskil", "Karakoçan", "Keban", "Kovancılar", "Maden", "Merkez", "Palu", "Sivrice"],
      "Erzincan": ["Çayırlı", "İliç", "Kemah", "Kemaliye", "Merkez", "Otlukbeli", "Refahiye", "Tercan", "Üzümlü"],
      "Erzurum": ["Aşkale", "Aziziye", "Çat", "Hınıs", "Horasan", "İspir", "Karaçoban", "Karayazı", "Köprüköy", "Narman", "Oltu", "Olur", "Palandöken", "Pasinler", "Pazaryolu", "Şenkaya", "Tekman", "Tortum", "Uzundere", "Yakutiye"],
      "Eskişehir": ["Alpu", "Beylikova", "Çifteler", "Günyüzü", "Han", "İnönü", "Mahmudiye", "Mihalgazi", "Mihalıççık", "Odunpazarı", "Sarıcakaya", "Seyitgazi", "Sivrihisar", "Tepebaşı"],
      "Gaziantep": ["Araban", "İslahiye", "Karkamış", "Nizip", "Nurdağı", "Oğuzeli", "Şahinbey", "Şehitkamil", "Yavuzeli"],
      "Giresun": ["Alucra", "Bulancak", "Çamoluk", "Çanakçı", "Dereli", "Doğankent", "Espiye", "Eynesil", "Görele", "Güce", "Keşap", "Merkez", "Piraziz", "Şebinkarahisar", "Tirebolu", "Yağlıdere"],
      "Gümüşhane": ["Kelkit", "Köse", "Kürtün", "Merkez", "Şiran", "Torul"],
      "Hakkâri": ["Çukurca", "Merkez", "Şemdinli", "Yüksekova"],
      "Hatay": ["Altınözü", "Antakya", "Arsuz", "Belen", "Defne", "Dörtyol", "Erzin", "Hassa", "İskenderun", "Kırıkhan", "Kumlu", "Payas", "Reyhanlı", "Samandağı", "Yayladağı"],
      "Isparta": ["Aksu", "Atabey", "Eğirdir", "Gelendost", "Gönen", "Keçiborlu", "Merkez", "Senirkent", "Sütçüler", "Şarkikaraağaç", "Uluborlu", "Yalvaç", "Yenişarbademli"],
      "Mersin": ["Akdeniz", "Anamur", "Aydıncık", "Bozyazı", "Çamlıyayla", "Erdemli", "Gülnar", "Mezitli", "Mut", "Silifke", "Tarsus", "Toroslar", "Yenişehir"],
      "İstanbul (Avrupa)": ["Adalar", "Arnavutköy", "Avcılar", "Bağcılar", "Bahçelievler", "Bakırköy", "Başakşehir", "Bayrampaşa", "Beşiktaş", "Beylikdüzü", "Beyoğlu", "Büyükçekmece", "Çatalca", "Çekmeköy", "Eminönü", "Esenler", "Esenyurt", "Eyüpsultan", "Fatih", "Gaziosmanpaşa", "Güngören", "Kağıthane", "Küçükçekmece", "Sancaktepe", "Sarıyer", "Silivri", "Sultanbeyli", "Sultangazi", "Şile", "Şişli", "Zeytinburnu"],
      "İstanbul (Anadolu)": ["Ataşehir", "Beykoz", "Kadıköy", "Kartal", "Maltepe", "Pendik", "Tuzla", "Ümraniye", "Üsküdar"],
      "İzmir": ["Aliağa", "Balçova", "Bayındır", "Bayraklı", "Bergama", "Beydağ", "Bornova", "Buca", "Çeşme", "Çiğli", "Dikili", "Foça", "Gaziemir", "Güzelbahçe", "Karabağlar", "Karaburun", "Karşıyaka", "Kemalpaşa", "Kınık", "Kiraz", "Konak", "Menderes", "Menemen", "Narlıdere", "Ödemiş", "Seferihisar", "Selçuk", "Tire", "Torbalı", "Urla"],
      "Kars": ["Arpaçay", "Digor", "Kağızman", "Merkez", "Sarıkamış", "Selim", "Susuz", "Akyaka"],
      "Kastamonu": ["Abana", "Ağlı", "Araç", "Azdavay", "Bozkurt", "Cide", "Çatalzeytin", "Daday", "Devrekani", "Doğanyurt", "Hanönü", "İhsangazi", "İnebolu", "Küre", "Merkez", "Pınarbaşı", "Seydiler", "Şenpazar", "Taşköprü", "Tosya", "Yapraklı"],
      "Kayseri": ["Akkışla", "Bünyan", "Develi", "Felahiye", "Hacılar", "İncesu", "Kocasinan", "Melikgazi", "Özvatan", "Pınarbaşı", "Sarıoğlan", "Sarız", "Talas", "Tomarza", "Yahyalı", "Yeşilhisar"],
      "Kırklareli": ["Babaeski", "Demirköy", "Kofçaz", "Lüleburgaz", "Merkez", "Pehlivanköy", "Pınarhisar", "Vize"],
      "Kırşehir": ["Akçakent", "Akpınar", "Boztepe", "Çiçekdağı", "Kaman", "Merkez", "Mucur"],
      "Kocaeli": ["Başiskele", "Çayırova", "Darıca", "Derince", "Dilovası", "Gebze", "Gölcük", "İzmit", "Kandıra", "Karamürsel", "Kartepe", "Körfez"],
      "Konya": ["Ahırlı", "Akören", "Akşehir", "Altınekin", "Beyşehir", "Bozkır", "Cihanbeyli", "Çeltik", "Çumra", "Derbent", "Derebucak", "Doğanhisar", "Emirgazi", "Ereğli", "Güneysınır", "Hadim", "Halkapınar", "Hüyük", "Ilgın", "Kadınhanı", "Karapınar", "Karatay", "Kulu", "Meram", "Sarayönü", "Selçuklu", "Seydişehir", "Taşkent", "Tuzlukçu", "Yalıhüyük", "Yunak"],
      "Kütahya": ["Altıntaş", "Aslanapa", "Çavdarhisar", "Domaniç", "Dumlupınar", "Emet", "Gediz", "Hisarcık", "Merkez", "Pazarlar", "Simav", "Şaphane", "Tavşanlı"],
      "Malatya": ["Akçadağ", "Arapgir", "Arguvan", "Battalgazi", "Darende", "Doğanşehir", "Doğanyol", "Hekimhan", "Kale", "Kuluncak", "Merkez", "Pütürge", "Yazıhan", "Yeşilyurt"],
      "Manisa": ["Ahmetli", "Akhisar", "Alaşehir", "Demirci", "Gölmarmara", "Gördes", "Kırkağaç", "Köprübaşı", "Kula", "Merkez", "Salihli", "Sarıgöl", "Saruhanlı", "Selendi", "Soma", "Şehzadeler", "Turgutlu", "Yunusemre"],
      "Kahramanmaraş": ["Afşin", "Andırın", "Çağlayancerit", "Dulkadiroğlu", "Ekinözü", "Elbistan", "Göksun", "Merkez", "Nurhak", "Onikişubat", "Pazarcık", "Türkoğlu"],
      "Mardin": ["Artuklu", "Dargeçit", "Derik", "Kızıltepe", "Mazıdağı", "Merkez", "Midyat", "Nusaybin", "Ömerli", "Savur", "Yeşilli"],
      "Muğla": ["Bodrum", "Dalaman", "Datça", "Fethiye", "Kavaklıdere", "Köyceğiz", "Marmaris", "Menteşe", "Milas", "Ortaca", "Seydikemer", "Ula", "Yatağan"],
      "Muş": ["Bulanık", "Hasköy", "Korkut", "Malazgirt", "Merkez", "Varto"],
      "Nevşehir": ["Acıgöl", "Avanos", "Derinkuyu", "Gülşehir", "Hacıbektaş", "Kozaklı", "Merkez", "Ürgüp"],
      "Niğde": ["Altunhisar", "Bor", "Çamardı", "Çiftlik", "Merkez", "Ulukışla"],
      "Ordu": ["Akkuş", "Altınordu", "Aybastı", "Çamaş", "Çatalpınar", "Çaybaşı", "Fatsa", "Gölköy", "Gülyalı", "Gürgentepe", "İkizce", "Kabadüz", "Kabataş", "Korgan", "Kumru", "Mesudiye", "Merkez", "Perşembe", "Piraziz", "Ulubey", "Ünye"],
      "Rize": ["Ardeşen", "Çamlıhemşin", "Çayeli", "Derepazarı", "Fındıklı", "Güneysu", "Hemşin", "İkizdere", "İyidere", "Kalkandere", "Merkez", "Pazar"],
      "Sakarya": ["Adapazarı", "Akyazı", "Arifiye", "Erenler", "Ferizli", "Geyve", "Hendek", "Karapürçek", "Karasu", "Kaynarca", "Kocaali", "Pamukova", "Sapanca", "Serdivan", "Söğütlü", "Taraklı"],
      "Samsun": ["19 Mayıs", "Alaçam", "Asarcık", "Atakum", "Ayvacık", "Bafra", "Canik", "Çarşamba", "Havza", "İlkadım", "Kavak", "Ladik", "Salıpazarı", "Tekkeköy", "Terme", "Vezirköprü", "Yakakent"],
      "Siirt": ["Baykan", "Eruh", "Kurtalan", "Merkez", "Pervari", "Şirvan", "Tillo"],
      "Sinop": ["Ayancık", "Boyabat", "Dikmen", "Durağan", "Erfelek", "Gerze", "Merkez", "Saraydüzü", "Türkeli"],
      "Sivas": ["Akıncılar", "Altınyayla", "Divriği", "Doğanşar", "Gemerek", "Gölova", "Gürün", "Hafik", "İmranlı", "Kangal", "Koyulhisar", "Merkez", "Suşehri", "Şarkışla", "Ulaş", "Yıldızeli", "Zara"],
      "Tekirdağ": ["Çerkezköy", "Çorlu", "Ergene", "Hayrabolu", "Kapaklı", "Malkara", "Marmaraereğlisi", "Muratlı", "Saray", "Şarköy", "Süleymanpaşa"],
      "Tokat": ["Almus", "Artova", "Başçiftlik", "Erbaa", "Merkez", "Niksar", "Pazar", "Reşadiye", "Sulusaray", "Turhal", "Yeşilyurt", "Zile"],
      "Trabzon": ["Akçaabat", "Araklı", "Arsin", "Beşikdüzü", "Çarşıbaşı", "Çaykara", "Dernekpazarı", "Düzköy", "Hayrat", "Köprübaşı", "Maçka", "Of", "Ortahisar", "Şalpazarı", "Sürmene", "Tonya", "Vakfıkebir", "Yomra"],
      "Tunceli": ["Çemişgezek", "Hozat", "Mazgirt", "Merkez", "Nazımiye", "Ovacık", "Pertek", "Pülümür"],
      "Şanlıurfa": ["Akçakale", "Birecik", "Bozova", "Ceylanpınar", "Eyyübiye", "Halfeti", "Haliliye", "Harran", "Hilvan", "Karaköprü", "Merkez", "Siverek", "Suruç", "Viranşehir"],
      "Uşak": ["Banaz", "Eşme", "Karahallı", "Merkez", "Sivaslı", "Ulubey"],
      "Van": ["Bahçesaray", "Başkale", "Çaldıran", "Çatak", "Edremit", "Erciş", "Gevaş", "Gürpınar", "İpekyolu", "Merkez", "Muradiye", "Özalp", "Saray", "Tuşba"],
      "Yozgat": ["Akdağmadeni", "Aydıncık", "Boğazlıyan", "Çandır", "Çayıralan", "Çekerek", "Kadışehri", "Merkez", "Saraykent", "Sarıkaya", "Şefaatli", "Sorgun", "Yenifakılı", "Yerköy"],
      "Zonguldak": ["Alaplı", "Çaycuma", "Devrek", "Ereğli", "Gökçebey", "Kilimli", "Kozlu", "Merkez"],
      "Aksaray": ["Ağaçören", "Eskil", "Gülağaç", "Güzelyurt", "Merkez", "Ortaköy", "Sarıyahşi", "Sultanhanı"],
      "Bayburt": ["Aydıntepe", "Demirözü", "Merkez"],
      "Karaman": ["Ayrancı", "Başyayla", "Ermenek", "Kazımkarabekir", "Merkez", "Sarıveliler"],
      "Kırıkkale": ["Bahşili", "Balışeyh", "Çelebi", "Delice", "Karakeçili", "Keskin", "Merkez", "Sulakyurt", "Yahşihan"],
      "Batman": ["Beşiri", "Gercüş", "Hasankeyf", "Kozluk", "Merkez", "Sason"],
      "Şırnak": ["Beytüşşebap", "Cizre", "Güçlükonak", "İdil", "Merkez", "Silopi", "Uludere"],
      "Bartın": ["Amasra", "Kurucaşile", "Merkez", "Ulus"],
      "Ardahan": ["Çıldır", "Damal", "Göle", "Hanak", "Merkez", "Posof"],
      "Iğdır": ["Aralık", "Karakoyunlu", "Merkez", "Tuzluca"],
      "Yalova": ["Altınova", "Armutlu", "Çınarcık", "Çiftlikköy", "Merkez", "Termal"],
      "Karabük": ["Eflani", "Eskipazar", "Merkez", "Ovacık", "Safranbolu", "Yenice"],
      "Kilis": ["Elbeyli", "Merkez", "Musabeyli", "Polateli"],
      "Osmaniye": ["Bahçe", "Düziçi", "Hasanbeyli", "Kadirli", "Merkez", "Sumbas", "Toprakkale"],
      "Düzce": ["Akçakoca", "Cumayeri", "Çilimli", "Gölyaka", "Gümüşova", "Kaynaşlı", "Merkez", "Yığılca"]
    };
    return districts[city] || [];
  };

  const getWhatsAppMessage = () => {
    if (!selectedCity || !selectedDistrict) return "";
    
    let message = `Merhabalar, ${selectedCity}, ${selectedDistrict}'daki arsamı sizin aracılığınızla satmak istiyorum.`;
    
    if (hasSahibindenListing && listingNumber) {
      message += ` Detaylarını paylaşıyorum. https://www.sahibinden.com/${listingNumber}`;
    } else {
      message += ` Detaylarını paylaşıyorum.`;
    }
    
    return encodeURIComponent(message);
  };

  const handleWhatsAppClick = () => {
    if (!selectedCity || !selectedDistrict) {
      alert("Lütfen şehir ve ilçe seçiniz.");
      return;
    }
    
    if (!acceptedCommission) {
      alert("Lütfen komisyon koşullarını kabul ediniz.");
      return;
    }
    
    if (hasSahibindenListing && !listingNumber) {
      alert("Lütfen Sahibinden ilan numaranızı giriniz.");
      return;
    }
    
    const message = getWhatsAppMessage();
    const whatsappUrl = `https://wa.me/905407208080?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const isFormValid = () => {
    if (!selectedCity || !selectedDistrict || !acceptedCommission) return false;
    if (hasSahibindenListing === true && !listingNumber) return false;
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-md md:max-w-2xl lg:max-w-2xl mx-auto px-6 py-4">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center animate-fade-in">
                <img src="/logo.png?v=2" alt="Yatırımlık Yerler" className="w-12 h-12 object-contain" />
              </div>
              <h1 className="text-xl font-bold text-[#012169] uppercase">YATIRIMLIK YERLER</h1>
            </div>
        </div>
      </header>

      {/* All Cards */}
      <section className="px-6 py-8">
        <div className="max-w-md md:max-w-2xl lg:max-w-2xl mx-auto space-y-4">
        
        {/* Arsamı Satmak İstiyorum */}
          <div className="border border-[#E7E9EC] rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300 bg-white">
            <button
              onClick={() => toggleDetail('satici')}
              className={`w-full text-left p-6 font-medium transition-colors duration-200 flex items-center justify-between ${openDetails.satici ? 'text-[#012169]' : 'text-zinc-700 hover:text-[#012169]'}`}
            >
              <span className="flex items-center gap-3">
                <span className="text-2xl">🏠</span>
              <span className="text-lg">Arsanı Bizimle Sat</span>
              </span>
              <span className={`transform transition-transform duration-200 ${openDetails.satici ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
             {openDetails.satici && (
               <div className="px-6 pb-6">
                 <div className="border-t border-[#012169]/10 pt-4">
                   <p className="text-sm text-zinc-600 mb-4 text-justify">
                  Arsanızı hızlı ve güvenli bir şekilde satmak için WhatsApp üzerinden bizimle iletişime geçin.
                </p>

                <div className="space-y-4">
                  {/* Şehir Seçimi */}
                         <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-2">
                      Şehir Seçiniz (Zorunlu) <span className="text-red-500">*</span>
                         </label>
                           <select
                      value={selectedCity}
                             onChange={(e) => {
                        setSelectedCity(e.target.value);
                        setSelectedDistrict("");
                        setHasSahibindenListing(null);
                        setListingNumber("");
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#012169] bg-white text-gray-900 font-medium"
                             required
                           >
                             <option value="">Şehir seçiniz</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                           </select>
                         </div>
                         
                         {/* İlçe Seçimi */}
                  {selectedCity && (
                           <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-2">
                        İlçe Seçiniz (Zorunlu) <span className="text-red-500">*</span>
                             </label>
                             <select
                               value={selectedDistrict}
                        onChange={(e) => {
                          setSelectedDistrict(e.target.value);
                          setHasSahibindenListing(null);
                          setListingNumber("");
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#012169] bg-white text-gray-900 font-medium"
                               required
                             >
                               <option value="">İlçe seçiniz</option>
                        {getDistricts(selectedCity).map((district) => (
                          <option key={district} value={district}>{district}</option>
                               ))}
                             </select>
                           </div>
                         )}
                         
                  {/* Sahibinden İlan Sorusu */}
                  {selectedDistrict && (
                         <div>
                         <label className="block text-xs font-medium text-zinc-700 mb-2">
                        Sahibinden.com'da ilanınız var mı? <span className="text-red-500">*</span>
                         </label>
                      <div className="flex gap-6">
                        <label className="flex items-center">
                           <input
                            type="radio"
                            name="hasListing"
                            value="yes"
                            checked={hasSahibindenListing === true}
                            onChange={() => {
                              setHasSahibindenListing(true);
                              setListingNumber("");
                            }}
                            className="mr-3 h-5 w-5 text-gray-900 focus:ring-gray-900 border-gray-900 bg-white"
                          />
                          <span className="text-sm text-gray-900">Evet</span>
                         </label>
                        <label className="flex items-center">
                           <input 
                            type="radio"
                            name="hasListing"
                            value="no"
                            checked={hasSahibindenListing === false}
                            onChange={() => {
                              setHasSahibindenListing(false);
                              setListingNumber("");
                            }}
                            className="mr-3 h-5 w-5 text-gray-900 focus:ring-gray-900 border-gray-900 bg-white"
                          />
                          <span className="text-sm text-gray-900">Hayır</span>
                         </label>
                           </div>
                           </div>
                         )}

                  {/* İlan Numarası */}
                  {hasSahibindenListing === true && (
                         <div>
                         <label className="block text-xs font-medium text-zinc-700 mb-2">
                        Sahibinden İlan Numarası (Zorunlu) <span className="text-red-500">*</span>
                         </label>
                     <input
                        type="text"
                        value={listingNumber}
                       onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 10) {
                            setListingNumber(value);
                          }
                        }}
                        placeholder="10 haneli ilan numarası"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#012169] bg-white text-gray-900 font-medium"
                        maxLength={10}
                           required
                      />
                      <div className="mt-1 flex justify-between items-center">
                        <span className={`text-xs ${listingNumber.length === 10 ? 'text-green-600' : 'text-red-500'}`}>
                          {listingNumber.length === 10 ? '✓ Geçerli ilan numarası' : 'Geçersiz ilan numarası'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {listingNumber.length}/10
                        </span>
                       </div>
                     </div>
                   )}

                  {/* Komisyon Kabul */}
                   <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-2">
                      Hizmet bedeli şartlarımızı kabul ediyor musunuz? <span className="text-red-500">*</span>
                     </label>
                    <label className="flex items-start gap-2">
                           <input
                             type="checkbox"
                        checked={acceptedCommission}
                        onChange={(e) => setAcceptedCommission(e.target.checked)}
                        className="mt-1"
                         required
                       />
                      <span className="text-xs text-zinc-700">
                        Arsamın dijital pazarlanması konusunda Yatırımlık Yerler'e 3 ay süreyle tam yetki vermeyi ve bu süreçte arsamın satılması durumunda %4+KDV'lik bir hizmet bedeli ödemeyi kabul ediyorum.
                      </span>
                         </label>
                       </div>
                       
                   <button
                    onClick={handleWhatsAppClick}
                    disabled={!isFormValid()}
                    className={`w-full rounded-xl p-3 text-center font-medium transition-all duration-300 text-sm flex items-center justify-center gap-2 ${
                      isFormValid()
                        ? 'bg-[#012169] text-white hover:bg-[#011a5a]' 
                             : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                         }`}
                       >
                         <span>📱</span>
                    <span>WhatsApp'tan Başvurunu Tamamla</span>
                   </button>
                   </div>
                   
                {/* FAQ Bölümü */}
                   <div className="mt-6">
                     <h4 className="font-medium text-sm text-zinc-800 mb-4">Sık Sorulan Sorular</h4>
                     <div className="space-y-3">
                    <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#012169]">
                      <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#012169] transition-colors">
                           1. Siz emlakçı mısınız?
                         </summary>
                         <div className="px-3 pb-3 text-sm text-zinc-600">
                           Hayır. Biz bir dijital pazarlama ajansıyız.<br />
                        Arsanızı emlakçı değil, iyi pazarlama satar — biz de bu konuda oldukça iyiyiz.
                         </div>
                       </details>
                       
                    <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#012169]">
                      <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#012169] transition-colors">
                           2. Hizmet bedeliniz nedir?
                         </summary>
                         <div className="px-3 pb-3 text-sm text-zinc-600">
                           Sadece satış olursa %4 + KDV hizmet bedeli alınır.<br />
                        (Siz net satış rakamını belirlersiniz, arsanız %4 eklenmiş brüt satış fiyatı üzerinden pazarlanır)<br />
                           Alıcıdan hiçbir bedel alınmaz; bu da satışı hızlandırır ve şeffaflık sağlar.
                         </div>
                       </details>
                       
                    <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#012169]">
                      <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#012169] transition-colors">
                           3. Süreç nasıl başlıyor?
                         </summary>
                         <div className="px-3 pb-3 text-sm text-zinc-600">
                        Arsanızı bize iletin, ekibimiz 48 saat içinde arsanızı değerlendirsin.<br />
                           Uygun görülürse 3 ay süreli dijital pazarlama sözleşmesi imzalanır ve süreç başlar.
                         </div>
                       </details>
                       
                    <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#012169]">
                      <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#012169] transition-colors">
                        4. Ne hizmeti veriyorsunuz?
                         </summary>
                         <div className="px-3 pb-3 text-sm text-zinc-600">
                           Biz yalnızca dijital pazarlama ve müşteri yönlendirme hizmeti sunarız.<br />
                        Satış aracılığı yapmayız; tapu işlemleri arsa sahibine aittir.
                         </div>
                       </details>
                       
                    <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#012169]">
                      <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#012169] transition-colors">
                           5. Diğer ilanlarımı yayında tutabilir miyim?
                         </summary>
                         <div className="px-3 pb-3 text-sm text-zinc-600">
                           Evet, bu sizin tercihinizdir.<br />
                        Ancak 3 ay boyunca Yatırımlık Yerler arsanızın dijital pazarlaması konusunda tek yetkili olur.<br />
                           Bu sürede satış gerçekleşirse, alıcının nereden geldiğine bakılmaksızın hizmet bedeline hak kazanırız.
                         </div>
                       </details>
                       
                    <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#012169]">
                      <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#012169] transition-colors">
                           6. Kabul kriterleri nelerdir?
                         </summary>
                         <div className="px-3 pb-3 text-sm text-zinc-600">
                        Yalnızca yatırım değeri yüksek arsalar kabul edilir.
                         </div>
                       </details>
                       
                    <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#012169]">
                      <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#012169] transition-colors">
                           7. Süreç gerçekten ücretsiz mi?
                         </summary>
                         <div className="px-3 pb-3 text-sm text-zinc-600">
                           Evet. Değerlendirme, içerik hazırlığı ve pazarlama tamamen ücretsizdir.<br />
                        Yalnızca satış gerçekleştiğinde hizmet bedeli doğar. Bu süreçte satış olmazsa herhangi bir ücret ödemek zorunda kalmazsınız.
                         </div>
                       </details>
                       
                    <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#012169]">
                      <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#012169] transition-colors">
                           8. Satış ne kadar sürer?
                         </summary>
                         <div className="px-3 pb-3 text-sm text-zinc-600">
                        Kabul edilen arsalar genellikle 4 hafta içinde yatırımcı bulur.
                         </div>
                       </details>
                       
                    <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#012169]">
                      <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#012169] transition-colors">
                           9. Satış süreci güvenli mi?
                         </summary>
                         <div className="px-3 pb-3 text-sm text-zinc-600">
                           Evet. Potansiyel alıcılar size yönlendirilmeden önce gerekli kontroller hukuk departmanımız tarafından yapılır.
                         </div>
                       </details>
                       
                    <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#012169]">
                      <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#012169] transition-colors">
                        10. Neden Yatırımlık Yerler'i seçmeliyim?
                         </summary>
                         <div className="px-3 pb-3 text-sm text-zinc-600">
                        Çünkü biz 200 bin takipçi ve aylık 5 milyondan fazla görüntülenme ile emlak alanında Türkiye'nin en güçlü dijital görünürlüğüne sahibiz.<br />
                        Arsanızı binlerce yatırımcının önüne ücretsiz çıkarıyor, yalnızca satış olursa kazanıyoruz.
                         </div>
                       </details>
                     </div>
                   </div>
                 </div>
               </div>
             )}
          </div>

        {/* Telegram ve WhatsApp Grupları */}
          <div className="border border-[#E7E9EC] rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300 bg-white">
            <button
              onClick={() => toggleDetail('groups')}
              className={`w-full text-left p-6 font-medium transition-colors duration-200 flex items-center justify-between ${openDetails.groups ? 'text-[#012169]' : 'text-zinc-700 hover:text-[#012169]'}`}
            >
              <span className="flex items-center gap-3">
                <span className="text-2xl">👥</span>
              <span className="text-lg">Gruplarımıza Katıl</span>
              </span>
              <span className={`transform transition-transform duration-200 ${openDetails.groups ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {openDetails.groups && (
              <div className="px-6 pb-6">
                <div className="border-t border-[#012169]/10 pt-4">
                  <p className="text-sm text-zinc-600 mb-4 text-justify">
                    Yatırımcı gruplarımıza tamamen ücretsiz katıl, yatırımlık arsa fırsatlarını kaçırma!
                  </p>
                  <div className="space-y-3">
                    <a
                      href="https://t.me/yatirimlikyerlercom"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-4 rounded-lg transition-all duration-200 text-sm font-medium"
                    >
                      📱 Telegram Grubumuza Katıl
        </a>
        <a
                      href="https://www.instagram.com/channel/AbZ69JrdXFHmu1Ou/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white text-center py-3 px-4 rounded-lg transition-all duration-200 text-sm font-medium"
        >
                      📸 Instagram Grubumuza Katıl
        </a>
                    <a
                      href="https://wa.me/905407208080"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-green-600 hover:bg-green-700 text-white text-center py-3 px-4 rounded-lg transition-all duration-200 text-sm font-medium"
                    >
                      📱 WhatsApp Grubumuza Katıl
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Hakkımızda */}
          <div className="border border-[#E7E9EC] rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300 bg-white">
            <button
            onClick={() => toggleDetail('about')}
            className={`w-full text-left p-6 font-medium transition-colors duration-200 flex items-center justify-between ${openDetails.about ? 'text-[#012169]' : 'text-zinc-700 hover:text-[#012169]'}`}
            >
              <span className="flex items-center gap-3">
                <span className="text-2xl">ℹ️</span>
                <span className="text-lg">Hakkımızda</span>
              </span>
            <span className={`transform transition-transform duration-200 ${openDetails.about ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
          {openDetails.about && (
              <div className="px-6 pb-6">
                <div className="border-t border-[#012169]/10 pt-4">
                <div className="prose prose-gray max-w-none">
                  <p className="text-sm text-zinc-600 mb-3">
                    Yatırımlık Yerler, Yatırımlık Evler markası altında faaliyet gösteren, arsa alanında öncü bir dijital pazarlama ajansıdır.
                  </p>
                  <p className="text-sm text-zinc-600 mb-3">
                    Amacımız, yatırımcıları yüksek getiri potansiyeline sahip doğru arsalarla buluşturmaktır.
                  </p>
                  <p className="text-sm text-zinc-600 mb-3">
                    Platformumuzda yalnızca yatırım değeri yüksek ve gelecek vadeden arsalar yer alır.
                  </p>
                  <p className="text-sm text-zinc-600 mb-3">
                    Arsa sahibiyseniz, mülkünüzü güvenli ve hızlı satmak için yukarıdaki formu doldurarak başvurunuzu yapabilirsiniz.
                  </p>
                  <p className="text-sm text-zinc-600">
                    Unutmayın, arsayı emlakçı değil, iyi pazarlama satar.
                     </p>
                   </div>
                 </div>
              </div>
            )}
          </div>

          {/* İletişim */}
          <div className="border border-[#E7E9EC] rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300 bg-white">
            <button
            onClick={() => toggleDetail('contact')}
            className={`w-full text-left p-6 font-medium transition-colors duration-200 flex items-center justify-between ${openDetails.contact ? 'text-[#012169]' : 'text-zinc-700 hover:text-[#012169]'}`}
            >
              <span className="flex items-center gap-3">
                <span className="text-2xl">📞</span>
                <span className="text-lg">Bize Ulaş</span>
              </span>
            <span className={`transform transition-transform duration-200 ${openDetails.contact ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
          {openDetails.contact && (
              <div className="px-6 pb-6">
                <div className="border-t border-[#012169]/10 pt-4">
                   <div className="space-y-4">
                     <p className="text-sm text-zinc-600">
                       Lütfen her türlü detaylı bilgi için bizlere Yatırımlık Evler WhatsApp Hattı üzerinden ulaşın:
                     </p>
                     
                     <a 
                    href="https://wa.me/905407208080"
                       target="_blank"
                       rel="noopener noreferrer"
                    className="block w-full bg-[#012169] hover:bg-[#011a5a] text-white text-center py-3 px-4 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                     >
                       <span>📱</span>
                    <span>WhatsApp'tan Bize Ulaş</span>
                     </a>
                     
                     <p className="text-sm text-zinc-600">
                       Kurumsal işbirlikleri için:
                     </p>
                     
                     <a 
                    href="mailto:info@yatirimlikevler.com?subject=Kurumsal İşbirliği Hk.&body=Merhabalar"
                    className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-600 text-center py-3 px-4 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                     >
                    <span>✉️</span>
                    <span>Email Gönder</span>
                     </a>
                   </div>
                 </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#012169]/10 px-6 py-6">
        <div className="max-w-md md:max-w-2xl lg:max-w-2xl mx-auto text-center">
          <p className="text-zinc-500 text-xs leading-relaxed">
            Yatırımlık Yerler © 2025 — Türkiye'nin İlk Premium Arsa Platformu
          </p>
      </div>
      </footer>
    </div>
  );
}