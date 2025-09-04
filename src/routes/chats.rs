use actix_web::{HttpResponse, Error};
use minijinja::context;

pub async fn chats() -> Result<HttpResponse, Error> {
    crate::templates::render_template(
        "chats",
        context! {
            title => "Chats Page",
        },
    )
}