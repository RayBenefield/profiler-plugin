/* eslint-disable max-statements */
export default class {
    
    constructor(enabled, el) {
        const e = document.createElement('div');

        e.classList = 'elapsed-time';
        e.style.display = enabled ? 'block' : 'none';

        const timeText = document.createElement('div');

        timeText.classList = 'elapsed-time-label';
        e.appendChild(timeText);
        el.appendChild(e);

        const points = document.createElement('div');

        points.classList = 'data-points';
        e.appendChild(points);
        el.appendChild(e);
        
        this.e = e;
        this.points = points;
        this.timeText = timeText;
    }

    updateChart(elapsedList) {
        const max = Math.max(...elapsedList);
        const min = Math.min(...elapsedList);
        const yScale = (max !== min) ? (100 / (max - min)) : 100;

        const pathData = elapsedList.map((v, index) => {
            let y = (Number(v) * yScale);
            let percent = `${Math.min(100, Math.max(1, y))}%`;

            return `<div class='data-point' title='${v} ms' data-index='${index}' style='height:${percent}'></div>`;
        });

        this.points.innerHTML = pathData.join('');
    }

    setStat(elapsedList) {
        const last = elapsedList[elapsedList.length - 1];
        const max = Math.max(...elapsedList);
        const min = Math.min(...elapsedList);

        this.timeText.innerText = `Last: ${last} ms | Min: ${min} ms | Max: ${max} ms`;
    }
}