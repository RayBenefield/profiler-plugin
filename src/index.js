import './index.sass';

function install(engine, params) {
    var els = new Map();
    var enabled = params.enabled !== false;
    var count = params.count || 10;

    Object.defineProperty(params, 'count', {
        get() {
            return count;
        },
        set(val) {
            count = val;
        }
    });

    Object.defineProperty(params, 'enabled', {
        get() {
            return enabled;
        },
        set(val) {
            enabled = val;
            els.forEach((el, node) => el.style.display = enabled ? 'block' : 'none')
        }
    });

    params.editor.on('rendernode', ({ el, node, component }) => {
        const e = document.createElement('div');
        let ms = [];

        e.classList = 'elapsed-time';
        e.style.display = enabled ? 'block' : 'none';
        els.set(node, e);

        const timeText = document.createElement('div');
        timeText.classList = 'elapsed-time-label';
        e.appendChild(timeText);
        el.appendChild(e);

        const points = document.createElement('div');
        points.classList = 'data-points';
        e.appendChild(points);
        el.appendChild(e);

        Object.defineProperty(node.meta, 'elapsed', {
            get() {
                return ms;
            },
            set(val) {
                ms = val;
                let pathData = [];
                let max = Math.max.apply(Math, val);
                let min = Math.min.apply(Math, val);
                const yScale = (max !== min) ? (100 / (max - min)) : 100;
                val.forEach((v, index) => {
                    let y = (Number(v) * yScale);
                    y = Math.min(100, Math.max(1, y));
                    pathData.push(`<div class='data-point' title='${val} ms' data-index='${index}' style='height:${y}%'></div>`);
                });
                pathData = pathData.join('');

                console.log(val);
                points.innerHTML = pathData;
                timeText.innerText = `Last: ${val[val.length - 1]} ms | Min: ${min} ms | Max: ${max} ms`;
            }
        });
    });

    params.editor.on('noderemoved', node => {
        els.delete(node);
    });

    engine.on('componentregister', component => {
        const pureWorker = component.worker;

        component.worker = async function () {
            const node = arguments[0];
            const silent = arguments[3] ? arguments[3].silent : false;

            var t = window.performance.now();

            await pureWorker.apply(this, arguments);

            var elapsed = window.performance.now() - t;

            if (params.editor && params.enabled && !silent) {
                var cNode = params.editor.nodes.find(n => n.id === node.id);
                var nodeElapsed = cNode.meta.elapsed;
                nodeElapsed.push(elapsed.toFixed(2));
                if (nodeElapsed.length > count) {
                    nodeElapsed.splice(0, 1);
                }
                cNode.meta.elapsed = nodeElapsed;
            }
        }
    });

    engine.on('componentregister', component => {
        const pureBuilder = component.builder;

        component.builder = async function () {
            var t = window.performance.now()

            await pureBuilder.apply(this, arguments)

            if (params.enabled)
                console.log('Node creation time: ', window.performance.now() - t)
        }
    });

}

export default {
    install
}