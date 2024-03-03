// Copiez moi dans la console :) (à partir de .hidden/htpasswd, il me semble)
var doublon = {}
var waitlist = []
var wait = 0
var sniffer = async (a) => {
  if (a.textContent === '../') {
  	wait--
    return
  }
  if (doublon[a.href]) {
  	wait--
    return console.log('doublon')
  }
  doublon[a.href] = true;
  const response = await fetch(a.href)
  const text = await response.text()
  if (a.textContent === 'README') {
    console.log(text)
  } else {
		waitlist.push([response.url, text])
  }
  wait--
  if (wait !== 0)
    return
  //console.log('next')
  const stack = waitlist.pop()
  setTimeout(() => {
  	const doc = (new DOMParser()).parseFromString(stack[1], "text/html")
    doc.querySelectorAll('body > pre > a').forEach((a) => {
      wait++
      a.href = stack[0] + '/' + a.getAttribute('href')
    })
    doc.querySelectorAll('body > pre > a').forEach(sniffer)
  }, 5)
}
document.querySelectorAll('body > pre > a').forEach((a) => {
  wait++
	if (a.getAttribute('href').indexOf('http') === -1)
  	a.href = document.location.href + '/' + a.getAttribute('href')
})
document.querySelectorAll('body > pre > a').forEach(sniffer)
