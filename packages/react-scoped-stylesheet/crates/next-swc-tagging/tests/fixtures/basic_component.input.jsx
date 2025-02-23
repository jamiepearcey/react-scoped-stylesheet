// Arrow function component
const Button = ()=>{
    return <div>Click me</div>;
};

// Function declaration component
function Card() {
    return <div>Card content</div>;
}

// Function expression component
const Container = function() {
    return <div>Container content</div>;
};

// Usage in JSX
const App = ()=>{
    return <div>
            <Button />
            <Card />
            <Container />
        </div>;
}; 