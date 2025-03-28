export function getTemplate(performance) {
  return `
    <h3 class="song">${performance.Song}</h3>
<h4 class="credit">${performance.Credit}</h4>
<div class="perf-desc">
  <p class="choir">${performance.Choir}</p>
  <p class="concertDate">${performance.Year}</p>
</div>
<div class="modifiers">
  <img class="edit" src="../media/pencil.webp" alt="edit symbol">
  <img class="delete" src="../media/delete.webp" alt="delete symbol">
</div>
  `
}