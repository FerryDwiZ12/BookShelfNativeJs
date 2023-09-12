const storageKey = "SUBMMISION";

const formMenambahBuku = document.getElementById("input_buku");
const formMencariBuku = document.getElementById("searchBook");

function CheckStorage() {
  return typeof Storage !== "undefined";
}

formMenambahBuku.addEventListener("submit", function (event) {
  const tittle = document.getElementById("inputJudulBuku").value;
  const penulis = document.getElementById("inputPenulisBuku").value;
  const tahun = parseInt(document.getElementById("inputTahunBuku").value);
  const diBaca = document.getElementById("inputKeteranganBuku").checked;

  const idSementara = document.getElementById("inputJudulBuku").name;
  if (idSementara !== "") {
    const dataBuku = GetBookList();
    for (let i = 0; i < dataBuku.length; i++) {
      if (dataBuku[i].id == idSementara) {
        dataBuku[i].tittle = tittle;
        dataBuku[i].penulis = penulis;
        dataBuku[i].tahun = tahun;
        dataBuku[i].diBaca = diBaca;
      }
    }
    localStorage.setItem(storageKey, JSON.stringify(dataBuku));
    ResetAllForm();
    RenderBookList(dataBuku);
    return;
  }

  const id = JSON.parse(localStorage.getItem(storageKey)) === null ? 0 + Date.now() : JSON.parse(localStorage.getItem(storageKey)).length + Date.now();
  const bukuBaru = {
    id: id,
    tittle: tittle,
    penulis: penulis,
    tahun: tahun,
    diBaca: diBaca,
  };

  putBookList(bukuBaru);

  const dataBuku = GetBookList();
  RenderBookList(dataBuku);
});

function putBookList(data) {
  if (CheckStorage()) {
    let dataBuku = [];

    if (localStorage.getItem(storageKey) !== null) {
      dataBuku = JSON.parse(localStorage.getItem(storageKey));
    }

    dataBuku.push(data);
    localStorage.setItem(storageKey, JSON.stringify(dataBuku));
  }
}

function RenderBookList(dataBuku) {
  if (dataBuku === null) {
    return;
  }

  const cardBelumSelesai = document.getElementById("belumdibaca");
  const cardSelesai = document.getElementById("sudahdibaca");

  cardBelumSelesai.innerHTML = "";
  cardSelesai.innerHTML = "";
  for (let buku of dataBuku) {
    const id = buku.id;
    const tittle = buku.tittle;
    const penulis = buku.penulis;
    const tahun = buku.tahun;
    const diBaca = buku.diBaca;

    // Membuat item
    let itemBuku = document.createElement("article");
    itemBuku.classList.add("item_buku", "pilih_item");
    itemBuku.innerHTML = "<h3 name=" + id + ">" + tittle + "</h3>";
    itemBuku.innerHTML += "<p>penulis: " + penulis + "</p>";
    itemBuku.innerHTML += "<p>tahun: " + tahun + "</p>";

    // Card item action
    let cardItemAction = document.createElement("div");
    cardItemAction.classList.add("action");

    //  button orange
    const btnOrange = CreatebtnOrange(buku, function (event) {
      bukuSelesaiDibacaHandler(event.target.parentElement.parentElement);
      const dataBuku = GetBookList();
      ResetAllForm();
      RenderBookList(dataBuku);
    });

    // Membuat button merah
    const btnMerah = CreatebtnMerah(function (event) {
      HapusAnItem(event.target.parentElement.parentElement);
      const dataBuku = GetBookList();
      ResetAllForm();
      RenderBookList(dataBuku);
    });

    cardItemAction.append(btnOrange, btnMerah);

    itemBuku.append(cardItemAction);

    // mengubah status buku
    itemBuku.childNodes[0].addEventListener("click", function (event) {
      const id = event.target.getAttribute("name");
      const isRead = buku.diBaca;
      if (isRead) {
        moveBookToUnread(id);
      } else {
        moveBookToRead(id);
      }
    });

    // Belum dibaca
    if (diBaca === false) {
      cardBelumSelesai.append(itemBuku);
      continue;
    }

    // Selesai dibaca
    cardSelesai.append(itemBuku);
  }
}

function CreatebtnOrange(buku, eventListener) {
  const isSelesai = buku.diBaca ? "Belum Selesai" : " Selesai";

  const btnOrange = document.createElement("button");
  btnOrange.classList.add("orange");
  btnOrange.innerText = isSelesai + " di Baca";
  btnOrange.addEventListener("click", function (event) {
    eventListener(event);
  });
  return btnOrange;
}
function CreatebtnMerah(eventListener) {
  const btnMerah = document.createElement("button");
  btnMerah.classList.add("red");
  btnMerah.innerText = "Hapus Buku";
  btnMerah.addEventListener("click", function (event) {
    eventListener(event);
  });
  return btnMerah;
}

function bukuSelesaiDibacaHandler(itemElement) {
  const dataBuku = GetBookList();
  if (dataBuku.length === 0) {
    return;
  }

  const tittle = itemElement.childNodes[0].innerText;
  const namaTittleAtribut = itemElement.childNodes[0].getAttribute("name");
  for (let i = 0; i < dataBuku.length; i++) {
    if (dataBuku[i].tittle === tittle && dataBuku[i].id == namaTittleAtribut) {
      dataBuku[i].diBaca = !dataBuku[i].diBaca;
      break;
    }
  }
  localStorage.setItem(storageKey, JSON.stringify(dataBuku));
}

function searchBookList(tittle) {
  const dataBuku = GetBookList();
  if (dataBuku.length === 0) {
    return;
  }

  const daftarBuku = [];

  for (let i = 0; i < dataBuku.length; i++) {
    const tittleTemp = dataBuku[i].tittle.toLowerCase();
    const tittleTempTarget = tittle.toLowerCase();
    if (dataBuku[i].tittle.includes(tittle) || tittleTemp.includes(tittleTempTarget)) {
      daftarBuku.push(dataBuku[i]);
    }
  }
  return daftarBuku;
}

function btnOrangeHandler(parentElement) {
  let buku = bukuSelesaiDibacaHandler(parentElement);
  buku.diBaca = !buku.diBaca;
}

function GetBookList() {
  if (CheckStorage) {
    return JSON.parse(localStorage.getItem(storageKey));
  }
  return [];
}

function HapusAnItem(itemElement) {
  const dataBuku = GetBookList();
  if (dataBuku.length === 0) {
    return;
  }

  const namaTittleAtribut = itemElement.childNodes[0].getAttribute("name");
  for (let i = 0; i < dataBuku.length; i++) {
    if (dataBuku[i].id == namaTittleAtribut) {
      dataBuku.splice(i, 1);
      break;
    }
  }

  localStorage.setItem(storageKey, JSON.stringify(dataBuku));
}

function UpdateAnItem(itemElement) {
  if (itemElement.id === "belumdibaca" || itemElement.id === "sudahdibaca") {
    return;
  }

  const dataBuku = GetBookList();
  if (dataBuku.length === 0) {
    return;
  }

  const tittle = itemElement.childNodes[0].innerText;
  const penulis = itemElement.childNodes[1].innerText.slice(9, itemElement.childNodes[1].innerText.length);
  const dapatkanTahun = itemElement.childNodes[2].innerText.slice(7, itemElement.childNodes[2].innerText.length);
  const tahun = parseInt(dapatkanTahun);

  const diBaca = itemElement.childNodes[3].childNodes[0].innerText.length === "Selesai Dibaca".length ? false : true;

  const id = itemElement.childNodes[0].getAttribute("name");
  document.getElementById("inputJudulBuku").value = tittle;
  document.getElementById("inputJudulBuku").name = id;
  document.getElementById("inputPenulisBuku").value = penulis;
  document.getElementById("inputTahunBuku").value = tahun;
  document.getElementById("inputKeteranganBuku").checked = diBaca;

  console.log(id);
  for (let i = 0; i < dataBuku.length; i++) {
    console.log("for" + id);
    if (dataBuku[1].id == id) {
      dataBuku[i].id = id;
      dataBuku[i].tittle = tittle;
      dataBuku[i].penulis = penulis;
      dataBuku[i].tahun = tahun;
      dataBuku[i].diBaca = diBaca;
    }
  }
  localStorage.setItem(storageKey, JSON.stringify(dataBuku));
}

searchBook.addEventListener("submit", function (event) {
  event.preventDefault();
  const dataBuku = GetBookList();
  if (dataBuku.length === 0) {
    return;
  }
  const tittle = document.getElementById("cariJudulBuku").value;
  if (tittle === null) {
    RenderBookList(dataBuku);
    return;
  }
  const daftarBuku = searchBookList(tittle);
  RenderBookList(daftarBuku);
});

function ResetAllForm() {
  document.getElementById("inputJudulBuku").value = "";
  document.getElementById("inputPenulisBuku").value = "";
  document.getElementById("inputTahunBuku").value = "";
  document.getElementById("inputKeteranganBuku").checked = false;

  document.getElementById("cariJudulBuku").value = "";
}

window.addEventListener("load", function () {
  if (CheckStorage) {
    if (localStorage.getItem(storageKey) !== null) {
      const dataBuku = GetBookList();
      RenderBookList(dataBuku);
    }
  } else {
    alert("Aplikasi Browser yang anda gunakan tidak mendukung Web Storage");
  }
});
