/*
 books 表结构

 open_id: 添加人,
 title: 图书标题,
 author: 作者,
 image: 封面图,
 isbn13: 图书标识,
 pubdate: 发布时间,
 publisher: 发布社,
 pages: 总页数,
 catalog: 目录,
 author_intro: 作者简介,
 summary: 图书简介,
 price: 价格,
 tags: 标签,
 numRaters: 评价人数,
 average: 评分,
*/

-- ----------------------------
--  Table structure for `books`
-- ----------------------------
CREATE TABLE `books` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `open_id` varchar(100) NOT NULL,
  `title` varchar(200) NOT NULL,
  `author` varchar(100) NOT NULL,
  `image` varchar(100) DEFAULT NULL,
  `isbn` varchar(100) DEFAULT NULL,
  `pubdate` varchar(50) DEFAULT NULL,
  `publisher` varchar(50) DEFAULT NULL,
  `pages` varchar(20) DEFAULT NULL,
  `catalog` text,
  `author_intro` varchar(1800) DEFAULT NULL,
  `summary` varchar(2000) DEFAULT NULL,
  `price` varchar(20) DEFAULT NULL,
  `tags` varchar(100) DEFAULT NULL,
  `numRaters` int(11) DEFAULT NULL,
  `average` float DEFAULT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `count` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;


-- ----------------------------
--  Table structure for `comments`
-- ----------------------------
CREATE TABLE `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `open_id` varchar(100) NOT NULL,
  `book_id` varchar(100) NOT NULL,
  `comment` varchar(200) NOT NULL,
  `phone` varchar(100) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
