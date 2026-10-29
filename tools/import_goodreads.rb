#!/usr/bin/env ruby
# Regenera public/books.json desde una exportación local de Goodreads.
# Uso: ruby tools/import_goodreads.rb ruta/a/goodreads_library_export.csv
require "csv"
require "json"
input = ARGV.fetch(0) { abort "Indica la ruta del CSV exportado desde Goodreads." }
rows = CSV.read(input, headers: true, encoding: "bom|utf-8")
books = rows.map do |row|
  {
    id: row["Book Id"], title: row["Title"], author: row["Author"],
    additionalAuthors: row["Additional Authors"], rating: row["My Rating"].to_i,
    publisher: row["Publisher"], binding: row["Binding"],
    pages: row["Number of Pages"], year: row["Year Published"],
    originalYear: row["Original Publication Year"], dateRead: row["Date Read"],
    dateAdded: row["Date Added"], shelves: row["Bookshelves"],
    shelf: row["Exclusive Shelf"].to_s.empty? ? "unshelved" : row["Exclusive Shelf"],
    review: row["My Review"].to_s, spoiler: row["Spoiler"].to_s,
    readCount: row["Read Count"], isbn13: row["ISBN13"].to_s.gsub(/\A="?|"?\z/, "")
  }
end
counts = books.group_by { |book| book[:shelf] }.transform_values(&:length)
payload = { generatedFrom: File.basename(input), total: books.length, counts: counts, books: books }
Dir.mkdir("public") unless Dir.exist?("public")
File.write("public/books.json", JSON.pretty_generate(payload), mode: "w:UTF-8")
puts "Importados #{books.length} libros; #{books.count { |book| !book[:review].strip.empty? }} reseñas."
puts "Estanterías: #{counts}"
