import BooksGridWithPagination from "@/components/user/BooksGridWithPagination";
import React from "react";

const Popular = () => {
  return (
    <div>
      <div class="text-2xl md:text-2xl font-bold tracking-tight ml-10 mt-5">
        Popular Books
      </div>
      <BooksGridWithPagination query="popularBooks?" />
    </div>
  );
};

export default Popular;
