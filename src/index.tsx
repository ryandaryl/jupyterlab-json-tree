import { Widget } from '@lumino/widgets';
import { IRenderMime } from '@jupyterlab/rendermime-interfaces';
import * as React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { JSONTree } from 'react-json-tree';

// Provide an invalid theme object (this is on purpose!) to invalidate the
// react-json-tree's inline styles that override CodeMirror CSS classes
const theme = {
  scheme: 'jupyter',
  base00: 'invalid',
  base01: 'invalid',
  base02: 'invalid',
  base03: 'invalid',
  base04: 'invalid',
  base05: 'invalid',
  base06: 'invalid',
  base07: 'invalid',
  base08: 'invalid',
  base09: 'invalid',
  base0A: 'invalid',
  base0B: 'invalid',
  base0C: 'invalid',
  base0D: 'invalid',
  base0E: 'invalid',
  base0F: 'invalid',
  author: 'invalid'
};

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
    for (const [key, value] of Object.entries(kwargs)) kwargs[key] = eval(String(value))
    if (this._rootDOM === null) {
      this._rootDOM = createRoot(this.node);
    }
    return new Promise<void>((resolve, reject) => {
      this._rootDOM!.render(
        <JSONTree data={model.data["application/json"]} theme={{extend: theme}} {...kwargs} />
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
