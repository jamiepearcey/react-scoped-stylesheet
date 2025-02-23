use std::path::PathBuf;
use swc_core::ecma::{
    transforms::testing::test_fixture,
    parser::{Syntax, EsSyntax},
    visit::as_folder,
};
use next_swc_tagging::ComponentTagger;

#[test]
fn basic_component_transform() {
    let input = PathBuf::from("tests/fixtures/basic_component.input.jsx");
    let output = PathBuf::from("tests/fixtures/basic_component.output.jsx");
    
    test_fixture(
        Syntax::Es(EsSyntax {
            jsx: true,
            ..Default::default()
        }),
        &|_| as_folder(ComponentTagger::new()),
        &input,
        &output,
        Default::default(),
    );
}

#[test]
fn nested_components_transform() {
    let input = PathBuf::from("tests/fixtures/nested_components.input.jsx");
    let output = PathBuf::from("tests/fixtures/nested_components.output.jsx");
    
    test_fixture(
        Syntax::Es(EsSyntax {
            jsx: true,
            ..Default::default()
        }),
        &|_| as_folder(ComponentTagger::new()),
        &input,
        &output,
        Default::default(),
    );
}

#[test]
fn html_elements_transform() {
    let input = PathBuf::from("tests/fixtures/html_elements.input.jsx");
    let output = PathBuf::from("tests/fixtures/html_elements.output.jsx");
    
    test_fixture(
        Syntax::Es(EsSyntax {
            jsx: true,
            ..Default::default()
        }),
        &|_| as_folder(ComponentTagger::new()),
        &input,
        &output,
        Default::default(),
    );
} 