const audioContext = new AudioContext()

const NOTE_DETAILS = [
  { note: "C", key: "Z", frequency: 261.626 },
  { note: "Db", key: "S", frequency: 277.183 },
  { note: "D", key: "X", frequency: 293.665 },
  { note: "Eb", key: "D", frequency: 311.127 },
  { note: "E", key: "C", frequency: 329.628 },
  { note: "F", key: "V", frequency: 349.228 },
  { note: "Gb", key: "G", frequency: 369.994 },
  { note: "G", key: "B", frequency: 391.995 },
  { note: "Ab", key: "H", frequency: 415.305 },
  { note: "A", key: "N", frequency: 440 },
  { note: "Bb", key: "J", frequency: 466.164 },
  { note: "B", key: "M", frequency: 493.883 },
]

document.addEventListener("keydown", (e) => {
  if (e.repeat) return
  const letter = e.code
  const noteDetail = getNoteDetail(letter)

  if (noteDetail == null) return
  noteDetail.active = true
  playNotes()
})

document.addEventListener("keyup", (e) => {
  const letter = e.code
  const noteDetail = getNoteDetail(letter)

  if (noteDetail == null) return
  noteDetail.active = false
  playNotes()
})

function getNoteDetail(keyboardKey) {
  return NOTE_DETAILS.find((n) => `Key${n.key}` === keyboardKey)
}

function startNote(noteDetail, gainValue) {
  const gainNode = audioContext.createGain()
  gainNode.gain.value = gainValue
  const oscillator = audioContext.createOscillator()
  oscillator.frequency.value = noteDetail.frequency
  oscillator.type = "sine"
  oscillator.connect(gainNode).connect(audioContext.destination)
  oscillator.start()
  noteDetail.oscillator = oscillator
}

function playNotes() {
  NOTE_DETAILS.forEach((n) => {
    const keyElement = document.querySelector(`[data-note="${n.note}"]`)
    keyElement.classList.toggle("active", n.active || false)
    if (n.oscillator != null) {
      n.oscillator.stop()
      n.oscillator.disconnect()
    }
  })
  const activeNotes = NOTE_DETAILS.filter((n) => n.active)
  const gain = 1 / activeNotes.length
  activeNotes.forEach((n) => {
    startNote(n, gain)
  })
}
