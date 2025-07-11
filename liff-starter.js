window.onload = function () {
  const useNodeJS = false;
  const defaultLiffId = "2007732501-Kx1aXM93"; //  เปลี่ยนเป็น LIFF ID ของคุณ
  let myLiffId = defaultLiffId;

  if (useNodeJS) {
    fetch('/liff/send-id')
      .then(res => res.json())
      .then(json => {
        myLiffId = json.id;
        initializeLiff(myLiffId);
      })
      .catch(err => console.error(err));
  } else {
    initializeLiff(myLiffId);
  }
};

function initializeLiff(liffId) {
  liff.init({ liffId })
    .then(() => {
      if (!liff.isLoggedIn()) {
        liff.login();
      } else {
        sendLiff();
      }
    })
    .catch(err => {
      document.getElementById('status').textContent = '❌ เกิดข้อผิดพลาด: ' + err;
    });
}

function sendLiff() {
  const type = getParameterByName('type');
  const status = document.getElementById('status');

  const sentBy = {
    label: "Hello, Liff I'm",
    iconUrl: "https://i.ibb.co/tKhLYX4/activated.gif",
    linkUrl: "https://youtube.com"
  };

  if (type === 'text') {
    liff.sendMessages([{
      type: 'text',
      text: getParameterByName('text'),
      sentBy
    }]).then(() => {
      status.textContent = 'ส่งข้อความแล้ว';
      liff.closeWindow();
    });

  } else if (type === 'image') {
    const img = getParameterByName('img');
    liff.sendMessages([{
      type: 'image',
      originalContentUrl: img,
      previewImageUrl: img,
      sentBy
    }]).then(() => {
      status.textContent = 'ส่งรูปภาพแล้ว';
      liff.closeWindow();
    });

  } else if (type === 'video') {
    const video = getParameterByName('ocu');
    const preview = getParameterByName('piu') || "https://i.ibb.co/6RBHpqxN/FB-IMG-1752072513178.jpg";
    liff.sendMessages([{
      type: 'video',
      originalContentUrl: video,
      previewImageUrl: preview
    }]).then(() => {
      status.textContent = 'ส่งวิดีโอแล้ว';
      liff.closeWindow();
    });

  } else if (type === 'audio') {
    const audio = getParameterByName('link');
    const duration = parseInt(getParameterByName('duration')) || 60000;
    liff.sendMessages([{
      type: 'audio',
      originalContentUrl: audio,
      duration
    }]).then(() => {
      status.textContent = 'ส่งเสียงแล้ว';
      liff.closeWindow();
    });

  } else {
    status.textContent = " ";
  }
}

function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
