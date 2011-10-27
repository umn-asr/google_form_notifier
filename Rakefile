desc "Minifies the javascript file"
task :minify do
  minified_file = "google_form_notifier-min.js"
  `curl -s -d compilation_level=SIMPLE_OPTIMIZATIONS -d output_format=text -d output_info=compiled_code --data-urlencode js_code@google_form_notifier.js http://closure-compiler.appspot.com/compile > #{minified_file}`
  if $?.success?
    puts "Minified to #{minified_file}"
  end
end

desc "Generate Rocco docs"
task :doc do
  `rocco -o doc/ google_form_notifier.js`
  if $?.success?
    puts "Generated docs in doc/"
  end
end
