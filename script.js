let currentOctave = 5

const audioContext = new AudioContext()

const NOTE_DETAILS = [
  { note: "C", key: "Z", frequency: 32.703 },
  { note: "Db", key: "S", frequency: 34.648 },
  { note: "D", key: "X", frequency: 36.708 },
  { note: "Eb", key: "D", frequency: 38.891 },
  { note: "E", key: "C", frequency: 41.203 },
  { note: "F", key: "V", frequency: 43.654 },
  { note: "Gb", key: "G", frequency: 46.249 },
  { note: "G", key: "B", frequency: 48.999 },
  { note: "Ab", key: "H", frequency: 51.913 },
  { note: "A", key: "N", frequency: 55 },
  { note: "Bb", key: "J", frequency: 58.27 },
  { note: "B", key: "M", frequency: 61.735 },
]

document.addEventListener("keydown", (e) => {
  if (e.repeat) return
  const letter = e.code
  const noteDetail = getNoteDetail(letter)

  if (noteDetail == null) return
  noteDetail.active = true
  playNotes()

  e.preventDefault()
})

document.addEventListener("keyup", (e) => {
  const letter = e.code
  const noteDetail = getNoteDetail(letter)

  if (noteDetail == null) return
  noteDetail.active = false
  playNotes()
  e.preventDefault()
})

document.addEventListener("keydown", (e) => {
  const letter = e.code
  const noteDetail = getNoteDetail(letter)

  if (noteDetail == null) {
    if (letter === "ArrowLeft") {
      // Decrease the octave
      changeOctave(-1)
    } else if (letter === "ArrowRight") {
      // Increase the octave
      changeOctave(1)
    }
    return
  }

  noteDetail.active = true
  playNotes()

  e.preventDefault()
})

function changeOctave(direction) {
  currentOctave = Math.max(Math.min(currentOctave + direction, 7), 1)
  document.getElementById("current-octave").textContent = currentOctave
}

function getNoteDetail(keyboardKey) {
  return NOTE_DETAILS.find((n) => `Key${n.key}` === keyboardKey)
}

function startNote(noteDetail, gainValue) {
  const octaveMultiplier = Math.pow(2, currentOctave - 4)
  const gainNode = audioContext.createGain()
  gainNode.gain.value = gainValue
  const oscillator = audioContext.createOscillator()
  oscillator.frequency.value = noteDetail.frequency * octaveMultiplier
  oscillator.type = "square"
  oscillator.connect(gainNode).connect(audioContext.destination)
  oscillator.start()
  console.log(octaveMultiplier)
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
  console.log(activeNotes)
  const gain = 1 / activeNotes.length
  activeNotes.forEach((n) => {
    startNote(n, gain)
  })
}

// add arrow button to change octave left and right
