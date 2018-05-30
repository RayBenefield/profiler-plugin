import './index.sass';

export function install(engine, params) {
    var els = new Map();
    var enabled = params.enabled !== false;

    Object.defineProperty(params, 'enabled', {
        get () {
            return enabled;
        },
        set (val) {
            enabled = val;
            els.forEach((el, node) => el.style.display = enabled?'block':'none')
        }
    });
    
    params.editor.on('rendernode', ({ el, node, component }) => {
        const e = document.createElement('div');
        let ms = 0;

        e.classList = 'elapsed-time';
        e.style.display = enabled ? 'block' : 'none';
        els.set(node, e);
        el.appendChild(e);
        Object.defineProperty(node.meta, 'elapsed', {
            get() {
                return ms
            },
            set(val) {
                ms = val;
                e.innerHTML = val + ' ms';
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
            var t = window.performance.now()

            await pureWorker.apply(this, arguments)

            var elapsed = window.performance.now() - t;

            if (params.editor && params.enabled)
                params.editor.nodes.find(n => n.id === node.id).meta.elapsed = elapsed.toFixed(2);
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