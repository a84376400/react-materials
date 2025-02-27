import React from 'react';
import FormContext from './context';
import FormCore from './FormCore';

class Form extends React.Component {
  constructor(props) {
    super(props);
    const { initialValues, rules, linkages, onSubmit } = props;
    this.store = new FormCore({ initialValues, rules, linkages, onSubmit });

    this.state = {
      renderField: () => {},
      layout: undefined,
      store: this.store,
    };
  }

  onSubmit = event => this.store.submit(event);

  static getDerivedStateFromProps(nextProps, prevState) {
    // set renderField、layout before render
    const isRenderFieldChanged = nextProps.renderField !== prevState.renderField;
    const isLayoutChanged = nextProps.layout !== prevState.layout;
    if (isRenderFieldChanged || isLayoutChanged) {
      prevState.store.setConfig('renderField', nextProps.renderField);
      prevState.store.setConfig('layout', nextProps.layout);
      return {
        renderField: nextProps.someValue,
        layout: nextProps.layout,
      };
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    const { initialValues, rules, linkages, onSubmit } = this.props;
    if (prevProps.rules !== rules) {
      this.store.setConfig('rules', rules);
    }
    if (prevProps.linkages !== linkages) {
      this.store.setConfig('linkages', linkages);
    }
    if (prevProps.onSubmit !== onSubmit) {
      this.store.setConfig('onSubmit', onSubmit);
    }
    if (prevProps.initialValues !== initialValues) {
      this.store.setValues(initialValues);
    }
  }

  render() {
    const { initialValues, onSubmit, children, rules, linkages, renderField, layout, ...rest } = this.props;
    return (
      <FormContext.Provider value={this.store}>
        <form
          className="ice-form"
          onSubmit={this.onSubmit}
          {...rest}
        >
          { typeof children === 'function'
            ? children(this.store)
            : children
          }
        </form>
      </FormContext.Provider>
    );
  }
}

export default Form;
