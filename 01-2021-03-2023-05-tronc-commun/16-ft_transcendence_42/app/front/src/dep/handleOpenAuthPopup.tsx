export function handleOpenAuthPopup() {
  const href = 'http://' + window.location.hostname + ':8190/auth/';

  try {
    if (window.wOpen) { window.wOpen.close(); }

    let pos = '';
    if (window)
    {
      pos += ',height=' + Math.max(window.innerHeight - 200, 650);
      pos += ',left=' + (window.screenX + 4);
      pos += ',top=' + (window.screenY + (window.outerHeight - window.innerHeight) + 74);
    }
    window.wOpen = window.open(href, '', 'width=490' + pos);
  } catch (e) {
    window.wOpen = window.open(href, '', 'width=490,height=700');
  }

  //if (!window.wOpen.closed) { return false; }
}
