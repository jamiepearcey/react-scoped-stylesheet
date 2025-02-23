// Arrow function component
const Button = ()=>{
    return <div data-component="Button">Click me</div>;
};

// Function declaration component
function Card() {
    return <div data-component="Card">Card content</div>;
}

// Function expression component
const Container = function() {
    return <div data-component="Container">Container content</div>;
};

// Usage in JSX
const App = ()=>{
    return <div data-component="App">
            <Button/>
            <Card/>
            <Container/>
        </div>;
}; 