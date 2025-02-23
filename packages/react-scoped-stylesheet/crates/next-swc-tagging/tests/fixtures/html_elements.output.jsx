// Arrow function component with HTML elements
const Button = ()=>{
    return <button className="btn" data-component="Button">
            <span>Click me</span>
        </button>;
};

// Function declaration with HTML elements
function Card() {
    return <div className="card" data-component="Card">
            <h2>Card Title</h2>
            <p>Card content</p>
        </div>;
}

// Function expression with HTML elements
const Container = function() {
    return <section className="container" data-component="Container">
            <header>
                <h1>Container Title</h1>
            </header>
            <main>Container content</main>
        </section>;
};

// Mixed usage
const App = ()=>{
    return <div data-component="App">
            <Container>
                <Card>
                    <Button />
                </Card>
            </Container>
        </div>;
}; 