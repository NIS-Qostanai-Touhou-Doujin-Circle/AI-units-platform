use minijinja::{path_loader, Environment};
use minijinja_autoreload::AutoReloader;
use once_cell::sync::Lazy;

pub static TEMPLATES: Lazy<AutoReloader> = Lazy::new(|| {
    // Создаем AutoReloader, который будет пересоздавать окружение при изменениях
    AutoReloader::new(|notifier| {
        let mut env = Environment::new();
        // Указываем путь к директории с шаблонами
        let template_path = "templates";
        env.set_loader(path_loader(template_path));
        // Указываем notifier'у следить за этой директорией
        notifier.watch_path(template_path, true);
        Ok(env)
    })
});