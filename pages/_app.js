import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from '../components/NavigationBar';

export default function App({ Component, pageProps }) {
    return (
        <>
            <link
                    rel="stylesheet"
                    href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
                    integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
                    crossOrigin="anonymous"
                />

            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></link>

            <NavigationBar />
            <Component {...pageProps} />
        </>
    );
}
