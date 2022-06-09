// Model creation and training : https://www.kaggle.com/rakannimer/creating-a-word2vec-model-from-south-park-dialogue
import ml5 from "ml5";
import * as React from "react";
import { render } from "react-dom";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

class Word2VecConsumer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "stan",
      output: [],
      isLoading: false,
      error: null
    };
    this.predict = this.predict.bind(this);
  }
  async predict() {
    this.setState(s => ({ ...s, isLoading: true }));

    // console.log(model);
    const results = await this.model.nearest(this.state.input);
    if (results === null) {
      this.setState({ isLoading: false, error: "NO_PREDICTIONS", output: [] });
    } else {
      this.setState({ isLoading: false, output: results, error: null });
    }
    // hack for slow connections
  }
  async componentDidMount() {
    this.model = await ml5.word2vec(
      "https://ml-models.surge.sh/cartman-southpark-speech-word2vec.json"
    );
    await this.predict();
    // await this.predict();
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.renderImage !== this.props.renderImage) {
      // await this.predict();
    }
  }
  render() {
    return (
      <div>
        <div>
          <h4>Find closest words in Cartman's vocabulary to </h4>
          <input
            defaultValue={this.state.input}
            onChange={ev => {
              this.setState({ input: ev.target.value.toLowerCase() }, () =>
                this.predict()
              );
            }}
          />
          <button
            onClick={async () => {
              await this.predict();
            }}
          >
            Find nearest
          </button>
        </div>
        <div>
          Nearest words to {this.state.input} :
          <pre>{JSON.stringify(this.state.output, null, 2)}</pre>
          <pre>error {JSON.stringify(this.state.error)}</pre>
          <pre> isLoading {JSON.stringify(this.state.isLoading)}</pre>
        </div>
      </div>
    );
  }
}

render(<Word2VecConsumer />, document.getElementById("app"));
// document.getElementById("app").innerHTML = `
// `;
