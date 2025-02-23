use swc_core::ecma::{
    ast::*,
    visit::{as_folder, FoldWith, VisitMut, VisitMutWith},
};
use swc_core::plugin::{plugin_transform, proxies::TransformPluginProgramMetadata};
use swc_core::common::SyntaxContext;

pub struct ComponentTagger {
    current_component_name: Option<String>,
    has_added_attr: bool,
    is_app_component: bool,
}

impl ComponentTagger {
    pub fn new() -> Self {
        ComponentTagger {
            current_component_name: None,
            has_added_attr: false,
            is_app_component: false,
        }
    }

    fn create_data_component_attr(&self, span: swc_core::common::Span, name: String) -> JSXAttrOrSpread {
        JSXAttrOrSpread::JSXAttr(JSXAttr {
            span,
            name: JSXAttrName::Ident(Ident::new("data-component".into(), span, SyntaxContext::empty()).into()),
            value: Some(JSXAttrValue::Lit(Lit::Str(name.into())))
        })
    }
}

impl VisitMut for ComponentTagger {
    fn visit_mut_jsx_element(&mut self, jsx: &mut JSXElement) {
        if let JSXElementName::Ident(ident) = &jsx.opening.name {
            if !ident.sym.starts_with(|c: char| c.is_uppercase()) {
                // If we're inside a component and haven't added the attribute yet
                if let Some(current_name) = &self.current_component_name {
                    if !self.has_added_attr {
                        // Add the data-component attribute to root element
                        jsx.opening.attrs.push(self.create_data_component_attr(jsx.span, current_name.clone()));
                        self.has_added_attr = true;
                    }
                } else if self.is_app_component && !self.has_added_attr {
                    // Add data-component="App" to the root element of the App component
                    jsx.opening.attrs.push(self.create_data_component_attr(jsx.span, "App".to_string()));
                    self.has_added_attr = true;
                }
            }
        }
        
        // Visit children after handling the current element
        jsx.children.visit_mut_with(self);
    }

    fn visit_mut_fn_decl(&mut self, func: &mut FnDecl) {
        // Store the current component name if this is a component
        let prev_name = self.current_component_name.take();
        let prev_has_added = self.has_added_attr;
        let prev_is_app = self.is_app_component;
        
        if func.ident.sym.starts_with(|c: char| c.is_uppercase()) {
            self.current_component_name = Some(func.ident.sym.to_string());
            self.has_added_attr = false;
            self.is_app_component = func.ident.sym == *"App";
        }

        // Visit children
        func.function.visit_mut_with(self);

        // Restore previous state
        self.current_component_name = prev_name;
        self.has_added_attr = prev_has_added;
        self.is_app_component = prev_is_app;
    }

    fn visit_mut_var_decl(&mut self, var: &mut VarDecl) {
        for decl in &mut var.decls {
            if let Some(init) = &mut decl.init {
                if let Some(name) = &decl.name.as_ident() {
                    // Check if it's a component (starts with uppercase)
                    if name.sym.starts_with(|c: char| c.is_uppercase()) {
                        // Store the current component name
                        let prev_name = self.current_component_name.take();
                        let prev_has_added = self.has_added_attr;
                        let prev_is_app = self.is_app_component;
                        
                        self.current_component_name = Some(name.sym.to_string());
                        self.has_added_attr = false;
                        self.is_app_component = name.sym == *"App";

                        // Visit the initialization
                        init.visit_mut_with(self);

                        // Restore previous state
                        self.current_component_name = prev_name;
                        self.has_added_attr = prev_has_added;
                        self.is_app_component = prev_is_app;
                    } else {
                        init.visit_mut_with(self);
                    }
                } else {
                    init.visit_mut_with(self);
                }
            }
        }
    }

    fn visit_mut_module(&mut self, module: &mut Module) {
        // Visit the rest of the module
        module.visit_mut_children_with(self);
    }
}

#[plugin_transform]
pub fn process_transform(program: Program, _metadata: TransformPluginProgramMetadata) -> Program {
    program.fold_with(&mut as_folder(ComponentTagger::new()))
} 