import { type } from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

//Create __dirname in an ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
    entry:'./docs/pageScripts/index.js', //main js file
    output: {
        filename:'bundle.js', // the bundled ouptut js file
        path: path.resolve(__dirname, 'docs/dist'), //output directory
    },
    module: {
        rules:[
            {
                test:/\.css/, //handle CSS files.
                use:['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpg|gig|svg)$/, //handles images
                type: 'asset/resource'
            }, 
            {
                test:/\.js$/,
                exclude: /node_modules/,
                use:{
                    loader: 'babel-loader', //transpile ES6+
                }
            }   
        ]
    },
    devServer:{
        contentBase:'./dist',
    },
    mode:'development'
}