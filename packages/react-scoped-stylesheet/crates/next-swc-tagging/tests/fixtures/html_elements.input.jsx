// Arrow function component with HTML elements
const Button = ()=>{
    return <button className="btn">
            <span>Click me</span>
        </button>;
};

// Function declaration with HTML elements
function Card() {
    return <div className="card">
            <h2>Card Title</h2>
            <p>Card content</p>
        </div>;
}

// Function expression with HTML elements
const Container = function() {
    return <section className="container">
            <header>
                <h1>Container Title</h1>
            </header>
            <main>Container content</main>
        </section>;
};

// Mixed usage
const App = ()=>{
    return <div>
            <Container>
                <Card>
                    <Button />
                </Card>
            </Container>
        </div>;
}; 