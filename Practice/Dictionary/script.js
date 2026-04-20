const dictionaryForm = document.getElementById('search_form');
const searchInput = document.getElementById('search_input');
const wordResults = document.getElementById('word_searched');
const audioContainer = document.getElementById('audio_container');
const pronounciationAudio = document.getElementById('pronounciation_audio');
const synonymsList = document.getElementById('synonyms');
const sourceDetails = document.getElementById('source_details');
const themeToggle = document.getElementById('theme_toggle');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

dictionaryForm.addEventListener('submit', function(event){
    event.preventDefault();
    const wordToSearch = searchInput.value.trim();
    if(!wordToSearch) return;

    // clearing the previous results
    wordResults.innerHTML ="<li>Loading...</li>";
    synonymsList.innerHTML = "";
    sourceDetails.innerHTML = "";

    //fetching the word data from the API
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordToSearch}`)

    .then(response=>{
        if(!response.ok)
            throw new Error('Word not found');
        return response.json();
    })
    .then(data=>{
        renderData(data[0])
    })
    .catch(error=>{
        wordResults.innerHTML = `<li style="color:red>${error.message}</li>`;
        console.error('Error fetching data:', error);
    })
})

//Helper function to render the data on the page
function renderData(wordData){
    // Logic for "Max 3 Definitions"
    const meanings = wordData.meanings[0].definitions;
    const topThree = meanings.slice(0,3); // Limiting to 3 definitions

    const defintionsHTML = topThree.map((def, index)=>
   `<li><strong>Def ${index + 1}:</strong> ${def.definition}</li>` 
).join('');

    // Displaying the word and its phonetics
    wordResults.innerHTML = `
    <li><strong>Word:</strong>${wordData.word}</li>
    <li><strong>Part of speech:</strong>${wordData.meanings[0].partOfSpeech}</li>
    ${defintionsHTML}`;

    // Handling Synonyms(Task 1 requirement)
    const synonyms = wordData.meanings[0].synonyms;
    if(synonyms && synonyms.length >0){
        synonymsList.innerHTML = synonyms.map(s => `<li>${s}</li>`).join('');
    }else{
        synonymsList.innerHTML = "<li>None found</li>";
    }

    //Handling Audio Pronounciation(Task 2 requirement)
    const audioObj = wordData.phonetics.find(p=>p.audio !=="");
    if(audioObj){
        pronounciationAudio.src = audioObj.audio;
        pronounciationAudio.style.display ="block";
    }else{
        pronounciationAudio.style.display = "none";
    }

    //sourcedetails
    sourceDetails.innerHTML = `<li><a href="${wordData.sourceUrls[0]}" target="_blank">View API Details</a></li>`;
}