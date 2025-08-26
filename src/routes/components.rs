use actix_web::{HttpResponse, Error};
use minijinja::context;

pub async fn components() -> Result<HttpResponse, Error> {
    crate::templates::render_template(
        "components",
        context! {
            title => "Components Page",
        },
    )
}