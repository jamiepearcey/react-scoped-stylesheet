// Arrow function components
const Button = ()=>{
    return <div>Click me</div>;
};

// Function declaration component with children
function Card({ children }) {
    return <div className="card">
            {children}
        </div>;
}

// Function expression component with children
const Container = function({ children }) {
    return <div className="container">
            {children}
        </div>;
};

// Nested usage
const App = ()=>{
    return <Container>
            <Card>
                <Button />
            </Card>
        </Container>;
}; 