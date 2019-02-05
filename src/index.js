import { observe, wrapperElapsed } from './utils';
import View from './view';
import './index.sass';

function install(engine, params) {
    const els = new Map();

    observe(params, 'count', params.count || 10);
    observe(params, 'enabled', params.enabled !== false, () => {
        els.forEach((el, node) => {
            el.style.display = params.enabled ? 'block' : 'none'
        });
    });

    params.editor.on('rendernode', ({ el, node, component }) => {
        const view = new View(params.enabled, el);

        els.set(node, view.e);

        observe(node.meta, 'elapsed', [], (val) => {
            view.updateChart(val);
            view.setStat(val);
        });
    });

    params.editor.on('noderemoved', node => {
        els.delete(node);
    });

    engine.on('componentregister', component => {
        component.worker = wrapperElapsed(component.worker, async (elapsed, node, inp, out, { silent = false } = {}) => {

            if (params.editor && params.enabled && !silent) {
                let cNode = params.editor.nodes.find(n => n.id === node.id);
                let nodeElapsed = cNode.meta.elapsed;

                nodeElapsed.push(elapsed.toFixed(2));
                if (nodeElapsed.length > params.count) {
                    nodeElapsed.splice(0, 1);
                }
                cNode.meta.elapsed = nodeElapsed;
            }
        });
    });

    engine.on('componentregister', component => {
        component.builder = wrapperElapsed(component.builder, async (elapsed) => {
            if (!params.enabled) return
            
            console.log('Node creation time: ', elapsed)
        });
    });

}

export default {
    install
}