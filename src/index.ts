import { Widget } from '@lumino/widgets';

import { IRenderMime } from '@jupyterlab/rendermime-interfaces';

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
    return new Promise<void>((resolve, reject) => {
      resolve();
    });
  }
}

/**
 * A mime renderer factory for data.
 */
export const rendererFactory: IRenderMime.IRendererFactory = {
  safe: false,
  mimeTypes: ['application/vnd.fasta.fasta'],
  createRenderer: options => new RenderedData(options)
};

const extensions = [{
  id: `json-expander:Fasta`,
  rendererFactory,
  rank: 0,
  dataType: 'string',
  fileTypes: [
    {
      name: "Fasta",
      extensions: ['.fasta', '.fa'],
      mimeTypes: ['application/vnd.fasta.fasta'],
      iconClass: 'jp-MaterialIcon jp-MSAIcon'
    }
  ],
  documentWidgetFactoryOptions: {
    name: "Fasta",
    primaryFileType: "Fasta",
    fileTypes: ["Fasta"],
    defaultFor: ["Fasta"]
  }
}];

export default extensions;
