desc "Minifies and concatenates javascript files"
task :minify do
  @version = `cat google_form_notifier.js | grep VERSION`.match(/\d\.\d\.\d/)
  @minified_file = "google_form_notifier-#{@version}-min.js"
  `curl -s -d compilation_level=SIMPLE_OPTIMIZATIONS -d output_format=text -d output_info=compiled_code --data-urlencode js_code@google_form_notifier.js http://closure-compiler.appspot.com/compile > #{@minified_file}`
  puts "Minified to #{@minified_file}" if $?.success?
end

desc "Minifies and bundles all dependencies into one file"
task :bundle => [:minify] do
  bundle_file = "google_form_notifier-#{@version}-bundled.js"
  `cat lib/underscore-min.js lib/handlebars.1.0.0.beta.3.js #{@minified_file} > #{bundle_file}`
  puts "Bundled dependencies into #{bundle_file}" if $?.success?
end

desc "Generate Rocco docs"
task :doc do
  `rocco -o doc/ google_form_notifier.js`
  if $?.success?
    puts "Generated docs in doc/"
  end
end
