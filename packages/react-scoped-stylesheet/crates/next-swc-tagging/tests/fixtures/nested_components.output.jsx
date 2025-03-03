// Arrow function components
const Button = ()=>{
    return <div data-component="Button">Click me</div>;
};

// Function declaration component with children
function Card({ children }) {
    return <div className="card" data-component="Card">
            {children}
        </div>;
}

// Function expression component with children
const Container = function({ children }) {
    return <div className="container" data-component="Container">
            {children}
        </div>;
};

// Nested usage
const App = ()=>{
    return <Container>
            <Card>
                <Button/>
            </Card>
        </Container>;
}; 