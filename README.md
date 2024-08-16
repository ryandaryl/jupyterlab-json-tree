# json-tree

A JupyterLab extension for rendering JSON using [react-json-tree](https://www.npmjs.com/package/react-json-tree)

## Requirements

- JupyterLab >= 3.0

## Install

```bash
pip install json-tree
```

## Usage

Use Python named arguments to pass parameters to the react-json-tree [JSONTree](https://github.com/reduxjs/redux-devtools/blob/61ec00f5059afab5eebb69ca15d9aa8c3e040bc9/packages/react-json-tree/src/index.tsx#L36) function.

For parameters that accept functions, pass Javascript functions as strings.

For example:

```python
from IPython import display
display.JSON(
    data={"c": [{"d": 7}, {"e": 9}]},
    hideRoot=True,
    shouldExpandNodeInitially="""
        (keyPath, data, level) => {return level === 1 || keyPath[0] === 1;}
    """,
    getItemString="() => {}"
)
```