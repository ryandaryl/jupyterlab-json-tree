import { Widget } from '@lumino/widgets';
import { IRenderMime } from '@jupyterlab/rendermime-interfaces';
import * as React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { JSONTree } from 'react-json-tree';

/**
 * A widget for rendering data, for usage with rendermime.
 */
export class RenderedData extends Widget implements IRenderMime.IRenderer {
  /**
   * Create a new widget for rendering Vega/Vega-Lite.
   */
  constructor(options: IRenderMime.IRendererOptions) {
    super();

    this.node.appendChild(document.createElement('input'));
  }

  /**
   * Render into this widget's node.
   */
  renderModel(model: IRenderMime.IMimeModel): Promise<void> {
    interface IPythonJsonArgs {
      [key: string]: any
    }
    var kwargs = model.metadata["application/json"] as Object as IPythonJsonArgs
    delete kwargs["root"];
    delete kwargs["expanded"];
    [
      "getItemString",
      "labelRenderer",
      "valueRenderer",
      "shouldExpandNodeInitially",
      "postprocessValue",
      "isCustomNode",
      "sortObjectKeys",
    ].forEach((k) => {
        if (k in kwargs) {
          kwargs[k] = eval(String(kwargs[k]))
        }
      }
    )
    if (this._rootDOM === null) {
      this._rootDOM = createRoot(this.node);
    }
    return new Promise<void>((resolve, reject) => {
      this._rootDOM!.render(
        <JSONTree data={model.data["application/json"]} {...kwargs} />
      );
    });
  }

  private _rootDOM: Root | null = null;
}

/**
 * A mime renderer factory for data.
 */
export const rendererFactory: IRenderMime.IRendererFactory = {
  safe: false,
  mimeTypes: ['application/json'],
  createRenderer: options => new RenderedData(options)
};

const extensions = [{
  id: `json-expander:Fasta`,
  rendererFactory,
  rank: 0,
  dataType: 'json',
  documentWidgetFactoryOptions: {
    name: 'JSON',
    primaryFileType: 'json',
    fileTypes: ['json', 'notebook', 'geojson'],
    defaultFor: ['json']
  }
}];

export default extensions;
