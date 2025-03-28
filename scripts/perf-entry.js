export function getTemplate(performance) {
  return `
    <h3 class="song">${performance.Song}</h3>
<h4 class="credit">${performance.Credit}</h4>
<div class="perf-desc">
  <p class="choir">${performance.Choir}</p>
  <p class="concertDate">${performance.Year}</p>
</div>
  `
}