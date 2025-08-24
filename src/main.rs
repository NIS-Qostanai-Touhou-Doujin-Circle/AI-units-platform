use actix_web::{web, App, HttpServer, HttpResponse, Error};
use minijinja::context;
mod templates; // Импортируем наш модуль

// Пример обработчика
async fn index() -> Result<HttpResponse, Error> {
    // Получаем доступ к актуальному окружению шаблонов
    let env = templates::TEMPLATES.acquire_env().map_err(|e| {
        // Преобразуем ошибку minijinja в ошибку actix_web
        actix_web::error::ErrorInternalServerError(e.to_string())
    })?;
    
    // Получаем конкретный шаблон
    let tmpl = env.get_template("index.html").map_err(|e| {
        actix_web::error::ErrorInternalServerError(e.to_string())
    })?;

    // Рендерим шаблон с контекстом
    let html = tmpl.render(context! {
        title => "Welcome!",
        name => "World",
    }).map_err(|e| {
        actix_web::error::ErrorInternalServerError(e.to_string())
    })?;

    Ok(HttpResponse::Ok().content_type("text/html; charset=utf-8").body(html))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Server running at http://127.0.0.1:8080");

    HttpServer::new(move |

| {
        App::new().route("/", web::get().to(index))
        // Здесь не нужно регистрировать TEMPLATES через.app_data(),
        // так как мы используем глобальный статический экземпляр.
    })
   .bind(("127.0.0.1", 8080))?
   .run()
   .await
}