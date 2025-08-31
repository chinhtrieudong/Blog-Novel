export interface Novel {
  id: number;
  title: string;
  author: string;
  description: string;
  genre: string;
  chapters: number;
  status: string;
  rating: number;
  reviews: number;
  views: number;
  likes: number;
  lastUpdate: string;
  cover: string;
  tags: string[];
  publishDate: string;
  totalWords: number;
  averageChapterLength: number;
}

export interface Chapter {
  id: number;
  novelId: number;
  title: string;
  content: string;
  publishDate: string;
  views: number;
  wordCount: number;
  likes: number;
  comments: number;
}

export interface ChapterComment {
  id: number;
  user: string;
  avatar: string;
  comment: string;
  time: string;
  likes: number;
}

// Fake data for novels
export const novels: Novel[] = [
  {
    id: 1,
    title: "Hành Trình Đến Với Ánh Sáng",
    author: "Nguyễn Minh Tâm",
    description:
      "Câu chuyện về một chàng trai trẻ tên Minh khám phá thế giới ma thuật đầy bí ẩn. Từ một người bình thường, anh dần khám phá ra những sức mạnh tiềm ẩn trong mình và bắt đầu hành trình tìm kiếm ánh sáng để cứu rỗi thế giới khỏi bóng tối. Với những cuộc phiêu lưu kỳ thú, những người bạn đồng hành trung thành và những thử thách khó khăn, Minh sẽ trưởng thành và trở thành một pháp sư mạnh mẽ. Tác phẩm kết hợp giữa yếu tố ma thuật cổ điển và những ý tưởng hiện đại, tạo nên một thế giới fantasy độc đáo và hấp dẫn.",
    genre: "Fantasy",
    chapters: 45,
    status: "Đang cập nhật",
    rating: 4.8,
    reviews: 1256,
    views: 25420,
    likes: 3241,
    lastUpdate: "2 giờ trước",
    cover: "/placeholder.svg?height=400&width=300",
    tags: [
      "Ma thuật",
      "Phiêu lưu",
      "Tình bạn",
      "Trưởng thành",
      "Chiến đấu",
      "Thế giới khác",
    ],
    publishDate: "15 tháng 6, 2024",
    totalWords: 450000,
    averageChapterLength: 10000,
  },
  {
    id: 2,
    title: "Vương Quốc Bóng Đêm",
    author: "Lê Thị Hương",
    description:
      "Một câu chuyện về cuộc chiến giữa ánh sáng và bóng tối trong một vương quốc cổ đại. Nhân vật chính là một công chúa trẻ phải đối mặt với những thử thách khó khăn để bảo vệ vương quốc của mình.",
    genre: "Fantasy",
    chapters: 32,
    status: "Hoàn thành",
    rating: 4.6,
    reviews: 892,
    views: 18750,
    likes: 2156,
    lastUpdate: "1 tuần trước",
    cover: "/placeholder.svg?height=400&width=300",
    tags: ["Vương quốc", "Công chúa", "Chiến đấu", "Tình yêu", "Bí ẩn"],
    publishDate: "10 tháng 5, 2024",
    totalWords: 320000,
    averageChapterLength: 10000,
  },
  {
    id: 3,
    title: "Thế Giới Game",
    author: "Trần Văn Nam",
    description:
      "Một game thủ chuyên nghiệp bỗng nhiên bị cuốn vào thế giới game mà anh từng chơi. Giờ đây anh phải sống trong thế giới đó và tìm cách trở về thế giới thực.",
    genre: "Game",
    chapters: 28,
    status: "Đang cập nhật",
    rating: 4.4,
    reviews: 567,
    views: 12340,
    likes: 1456,
    lastUpdate: "3 ngày trước",
    cover: "/placeholder.svg?height=400&width=300",
    tags: ["Game", "Isekai", "Phiêu lưu", "Hành động", "Hài hước"],
    publishDate: "20 tháng 7, 2024",
    totalWords: 280000,
    averageChapterLength: 10000,
  },
];

// Fake data for chapters
export const chapters: Chapter[] = [
  {
    id: 1,
    novelId: 1,
    title: "Chương 1: Khởi đầu của hành trình",
    content: `
      <p class="mb-6">Minh ngồi bên cửa sổ, nhìn ra ngoài khu vườn nhỏ của gia đình. Ánh nắng chiều vàng óng chiếu qua những tán lá xanh, tạo nên những vệt sáng lung linh trên sàn gỗ. Đây là một ngày bình thường như bao ngày khác, nhưng Minh không biết rằng cuộc sống của anh sắp thay đổi hoàn toàn.</p>

      <p class="mb-6">"Minh! Xuống ăn cơm đi con!" Tiếng mẹ gọi từ dưới nhà vang lên.</p>

      <p class="mb-6">"Dạ, con xuống ngay!" Minh đáp lại và đóng sách lại. Cuốn sách "Những bí ẩn của thế giới ma thuật" mà anh đang đọc là món quà sinh nhật từ ông nội, một người luôn tin vào những điều kỳ diệu.</p>

      <p class="mb-6">Khi Minh đi xuống cầu thang, anh cảm thấy có gì đó khác lạ. Không khí trong nhà có vẻ đặc biệt hơn, như thể có một năng lượng vô hình đang chuyển động xung quanh.</p>

      <p class="mb-6">"Con có thấy gì lạ không?" Mẹ hỏi khi Minh ngồi vào bàn ăn.</p>

      <p class="mb-6">"Không, tại sao mẹ hỏi vậy?"</p>

      <p class="mb-6">"Mẹ không biết, có cảm giác như có điều gì đó sắp xảy ra." Mẹ nhìn ra cửa sổ với vẻ lo lắng.</p>

      <p class="mb-6">Đúng lúc đó, một tiếng sấm vang lên từ xa, mặc dù bầu trời vẫn trong xanh. Minh và mẹ nhìn nhau, cả hai đều cảm thấy có điều gì đó không bình thường.</p>

      <p class="mb-6">"Có lẽ chỉ là thời tiết thay đổi thôi." Mẹ cố gắng trấn an, nhưng giọng nói của bà có vẻ không chắc chắn.</p>

      <p class="mb-6">Sau bữa ăn, Minh trở về phòng và tiếp tục đọc sách. Nhưng khi anh mở trang sách, những dòng chữ bỗng nhiên bắt đầu phát sáng. Minh dụi mắt, nghĩ rằng mình đang mơ, nhưng hiện tượng vẫn tiếp tục.</p>

      <p class="mb-6">"Điều này không thể nào..." Minh thì thầm.</p>

      <p class="mb-6">Những dòng chữ phát sáng bắt đầu bay lên khỏi trang sách, tạo thành những ký hiệu ma thuật trong không khí. Minh cảm thấy tim mình đập nhanh hơn, một cảm giác kỳ lạ tràn ngập trong người.</p>

      <p class="mb-6">"Chào mừng, người được chọn." Một giọng nói vang lên từ những ký hiệu ma thuật.</p>

      <p class="mb-6">Minh nhìn xung quanh, không thấy ai cả. "Ai... ai đang nói?"</p>

      <p class="mb-6">"Ta là người bảo vệ kiến thức ma thuật. Ngươi đã được chọn để tiếp nhận sức mạnh và trở thành một pháp sư."</p>

      <p class="mb-6">"Tôi? Một pháp sư? Điều này thật điên rồ!"</p>

      <p class="mb-6">"Không điên rồ chút nào. Ngươi có dòng máu ma thuật trong người, và bây giờ đã đến lúc thức tỉnh."</p>

      <p class="mb-6">Những ký hiệu ma thuật bắt đầu xoay tròn xung quanh Minh, tạo thành một vòng tròn phát sáng. Anh cảm thấy năng lượng chảy qua cơ thể, như những dòng điện nhỏ chạy dọc theo các dây thần kinh.</p>

      <p class="mb-6">"Đây là cảm giác của sức mạnh ma thuật." Giọng nói giải thích. "Ngươi sẽ học cách kiểm soát nó, và sử dụng nó để bảo vệ thế giới khỏi bóng tối đang đến."</p>

      <p class="mb-6">Minh cảm thấy choáng ngợp. Chỉ vài phút trước, anh còn là một cậu học sinh bình thường, giờ đây anh đã trở thành một pháp sư được chọn.</p>

      <p class="mb-6">"Tôi phải làm gì?" Minh hỏi.</p>

      <p class="mb-6">"Học hỏi, luyện tập, và chuẩn bị cho những thử thách phía trước. Hành trình của ngươi mới chỉ bắt đầu."</p>

      <p class="mb-6">Khi những ký hiệu ma thuật biến mất, Minh nhìn lại cuốn sách. Những dòng chữ đã trở về bình thường, nhưng anh biết rằng cuộc sống của mình sẽ không bao giờ như cũ nữa.</p>

      <p class="mb-6">Anh nhìn ra cửa sổ, nơi ánh nắng chiều vẫn chiếu sáng. Nhưng giờ đây, Minh thấy được nhiều hơn - những dòng năng lượng ma thuật chảy trong không khí, những sinh vật nhỏ bé ẩn nấp trong bóng tối, và một thế giới hoàn toàn mới đang chờ đợi anh khám phá.</p>

      <p class="mb-6">"Hành trình đến với ánh sáng..." Minh thì thầm, nhớ lại tiêu đề cuốn sách. "Có lẽ đây chính là khởi đầu."</p>

      <p class="mb-6">Và như vậy, câu chuyện về Minh, người pháp sư được chọn, chính thức bắt đầu...</p>
    `,
    publishDate: "15 tháng 6, 2024",
    views: 2234,
    wordCount: 8500,
    likes: 156,
    comments: 23,
  },
  {
    id: 2,
    novelId: 1,
    title: "Chương 2: Phát hiện sức mạnh",
    content: `
      <p class="mb-6">Sau đêm đó, Minh không thể ngủ được. Những ký hiệu ma thuật vẫn hiện ra trong tâm trí anh, và cảm giác năng lượng chảy trong cơ thể khiến anh cảm thấy bồn chồn.</p>

      <p class="mb-6">"Minh, con có sao không?" Mẹ hỏi khi thấy anh có vẻ mệt mỏi vào sáng hôm sau.</p>

      <p class="mb-6">"Con ổn, mẹ. Chỉ là... con có một giấc mơ kỳ lạ thôi."</p>

      <p class="mb-6">Minh không dám nói với mẹ về những gì đã xảy ra. Ông nội từng nói rằng không phải ai cũng có thể hiểu được thế giới ma thuật, và việc tiết lộ bí mật có thể gây nguy hiểm.</p>

      <p class="mb-6">Trên đường đến trường, Minh thử tập trung vào cảm giác năng lượng trong cơ thể. Anh nhắm mắt lại và cố gắng hình dung những ký hiệu ma thuật từ đêm qua.</p>

      <p class="mb-6">Bỗng nhiên, một quả cầu ánh sáng nhỏ xuất hiện trong lòng bàn tay anh.</p>

      <p class="mb-6">"Thật không thể tin được!" Minh thì thầm, nhìn chằm chằm vào quả cầu ánh sáng.</p>

      <p class="mb-6">Quả cầu phát sáng với ánh sáng ấm áp, như một ngọn đèn nhỏ. Minh có thể cảm thấy năng lượng chảy từ cơ thể vào quả cầu, và anh có thể điều khiển nó theo ý muốn.</p>

      <p class="mb-6">"Tôi thực sự có sức mạnh ma thuật!"</p>

      <p class="mb-6">Nhưng niềm vui của Minh không kéo dài lâu. Một tiếng cười lạnh vang lên từ phía sau.</p>

      <p class="mb-6">"Ồ, một pháp sư non nớt."</p>

      <p class="mb-6">Minh quay lại và thấy một người đàn ông mặc áo choàng đen đứng cách đó vài mét. Gương mặt người này ẩn trong bóng tối, nhưng Minh có thể cảm thấy năng lượng ma thuật mạnh mẽ tỏa ra từ người này.</p>

      <p class="mb-6">"Anh là ai?" Minh hỏi, cố gắng giữ bình tĩnh.</p>

      <p class="mb-6">"Ta là một trong những người bảo vệ bóng tối. Và ngươi, cậu bé, đang sở hữu một sức mạnh mà ta muốn có."</p>

      <p class="mb-6">Người đàn ông giơ tay lên, và một luồng năng lượng tối bay về phía Minh. Anh vội vàng né tránh, và quả cầu ánh sáng trong tay anh tự động bay ra để chặn đòn tấn công.</p>

      <p class="mb-6">"Thú vị. Ngươi có bản năng tự vệ tốt."</p>

      <p class="mb-6">Minh cảm thấy sợ hãi, nhưng cũng có một cảm giác kỳ lạ - như thể có ai đó đang hướng dẫn anh từ bên trong.</p>

      <p class="mb-6">"Hãy tập trung vào ánh sáng trong tim ngươi." Một giọng nói vang lên trong đầu Minh.</p>

      <p class="mb-6">Minh nhắm mắt lại và tập trung vào cảm giác ấm áp trong lồng ngực. Bỗng nhiên, toàn bộ cơ thể anh phát sáng với ánh sáng trắng thuần khiết.</p>

      <p class="mb-6">"Không thể nào!" Người đàn ông áo đen kêu lên, che mắt lại.</p>

      <p class="mb-6">Khi ánh sáng biến mất, người đàn ông đã không còn ở đó nữa. Minh thở hổn hển, cảm thấy mệt mỏi nhưng cũng cảm thấy mạnh mẽ hơn.</p>

      <p class="mb-6">"Cảm ơn, dù ngươi là ai." Minh thì thầm.</p>

      <p class="mb-6">Từ đó trở đi, Minh biết rằng cuộc sống của mình sẽ không bao giờ bình thường nữa. Anh đã trở thành một pháp sư, và có những kẻ thù đang săn lùng sức mạnh của anh.</p>

      <p class="mb-6">Nhưng anh cũng biết rằng mình không đơn độc. Có những người khác đang chiến đấu vì ánh sáng, và anh sẽ tìm thấy họ.</p>

      <p class="mb-6">Hành trình thực sự của Minh đã bắt đầu...</p>
    `,
    publishDate: "18 tháng 6, 2024",
    views: 2156,
    wordCount: 9200,
    likes: 142,
    comments: 19,
  },
  {
    id: 3,
    novelId: 1,
    title: "Chương 3: Người thầy đầu tiên",
    content: `
      <p class="mb-6">Sau cuộc gặp gỡ với người đàn ông áo đen, Minh cảm thấy cần phải học cách kiểm soát sức mạnh của mình. Anh nhớ lại lời khuyên của ông nội về việc tìm kiếm một người thầy.</p>

      <p class="mb-6">"Có một người thầy ma thuật sống trong rừng phía đông thành phố." Ông nội từng nói. "Ông ấy là một pháp sư mạnh mẽ và khôn ngoan."</p>

      <p class="mb-6">Vào cuối tuần, Minh quyết định tìm đến người thầy này. Anh đóng gói một ít đồ dùng và đi bộ về phía đông, nơi có khu rừng rậm rạp.</p>

      <p class="mb-6">Rừng trông khác hẳn so với những lần Minh đi qua trước đây. Bây giờ anh có thể thấy những dòng năng lượng ma thuật chảy qua các cây cối, và những sinh vật nhỏ bé ẩn nấp trong bóng tối.</p>

      <p class="mb-6">"Có vẻ như ngươi đã thức tỉnh." Một giọng nói vang lên từ phía trước.</p>

      <p class="mb-6">Minh nhìn lên và thấy một người đàn ông cao tuổi mặc áo choàng xanh đứng trước một ngôi nhà gỗ nhỏ. Người này có mái tóc bạc dài và đôi mắt sáng như những ngôi sao.</p>

      <p class="mb-6">"Ngươi là thầy ma thuật mà ông nội tôi nhắc đến?"</p>

      <p class="mb-6">"Có thể. Ta là Thầy Lâm, và ta đã chờ đợi ngươi từ rất lâu rồi."</p>

      <p class="mb-6">"Chờ đợi tôi?"</p>

      <p class="mb-6">"Đúng vậy. Ta đã thấy trước rằng một ngày nào đó, một pháp sư trẻ sẽ đến đây để học hỏi. Và ngươi chính là người đó."</p>

      <p class="mb-6">Thầy Lâm mở cửa ngôi nhà gỗ và mời Minh vào trong. Bên trong là một không gian ấm cúng với những cuốn sách ma thuật xếp đầy kệ, những bình thuốc kỳ lạ, và một bàn làm việc đầy những ký hiệu ma thuật.</p>

      <p class="mb-6">"Ngồi xuống đi." Thầy Lâm chỉ vào một chiếc ghế gỗ.</p>

      <p class="mb-6">Minh ngồi xuống và cảm thấy năng lượng ma thuật trong ngôi nhà này mạnh mẽ hơn bất cứ nơi nào anh từng đến.</p>

      <p class="mb-6">"Ngươi đã gặp kẻ thù đầu tiên rồi, phải không?"</p>

      <p class="mb-6">"Vâng, một người đàn ông mặc áo đen."</p>

      <p class="mb-6">"Đó là một trong những tay sai của Bóng Tối. Chúng đang săn lùng những pháp sư trẻ như ngươi để hấp thụ sức mạnh."</p>

      <p class="mb-6">"Tại sao chúng lại làm vậy?"</p>

      <p class="mb-6">"Vì chúng muốn thống trị thế giới này. Chúng tin rằng chỉ có sức mạnh mới đáng giá, và chúng sẵn sàng làm bất cứ điều gì để có được nó."</p>

      <p class="mb-6">Thầy Lâm đứng dậy và đi đến một kệ sách. Ông lấy ra một cuốn sách cổ có bìa da.</p>

      <p class="mb-6">"Đây là cuốn sách ma thuật đầu tiên mà ngươi sẽ học. Nó chứa đựng những kiến thức cơ bản về phép thuật ánh sáng."</p>

      <p class="mb-6">Minh cầm cuốn sách và cảm thấy năng lượng ấm áp chảy từ nó.</p>

      <p class="mb-6">"Cảm ơn thầy."</p>

      <p class="mb-6">"Đừng vội cảm ơn. Việc học ma thuật không dễ dàng. Ngươi sẽ phải luyện tập chăm chỉ và đối mặt với nhiều thử thách."</p>

      <p class="mb-6">"Tôi sẵn sàng."</p>

      <p class="mb-6">"Tốt. Bây giờ, hãy mở cuốn sách và bắt đầu bài học đầu tiên."</p>

      <p class="mb-6">Minh mở cuốn sách và thấy những dòng chữ phát sáng hiện ra. Đây là những kiến thức ma thuật đầu tiên mà anh sẽ học, và anh biết rằng đây chỉ là khởi đầu của một hành trình dài.</p>

      <p class="mb-6">"Hãy đọc to những dòng chữ này." Thầy Lâm hướng dẫn.</p>

      <p class="mb-6">Minh bắt đầu đọc, và những từ ngữ ma thuật vang lên trong không gian, tạo thành những hiệu ứng ánh sáng đẹp mắt.</p>

      <p class="mb-6">"Tuyệt vời. Ngươi có tài năng tự nhiên."</p>

      <p class="mb-6">Từ đó trở đi, Minh sẽ dành mỗi cuối tuần để học ma thuật với Thầy Lâm. Và mỗi bài học sẽ đưa anh đến gần hơn với việc trở thành một pháp sư mạnh mẽ.</p>

      <p class="mb-6">Hành trình học hỏi đã bắt đầu...</p>
    `,
    publishDate: "22 tháng 6, 2024",
    views: 2089,
    wordCount: 10100,
    likes: 167,
    comments: 28,
  },
];

// Fake comments for chapters
export const chapterComments: ChapterComment[] = [
  {
    id: 1,
    user: "Độc giả cuồng nhiệt",
    avatar: "/placeholder.svg?height=40&width=40",
    comment:
      "Chương này hay quá! Cách tác giả miêu tả việc khám phá sức mạnh ma thuật rất sinh động.",
    time: "2 giờ trước",
    likes: 15,
  },
  {
    id: 2,
    user: "Fan Fantasy",
    avatar: "/placeholder.svg?height=40&width=40",
    comment:
      "Minh thật sự có tài năng tự nhiên. Không thể chờ đợi để xem anh sẽ phát triển như thế nào.",
    time: "5 giờ trước",
    likes: 12,
  },
  {
    id: 3,
    user: "Người đọc thầm lặng",
    avatar: "/placeholder.svg?height=40&width=40",
    comment:
      "Thầy Lâm thật sự là một nhân vật thú vị. Hy vọng sẽ thấy nhiều hơn về ông ấy.",
    time: "1 ngày trước",
    likes: 8,
  },
];

// Helper functions
export function getNovelById(id: number): Novel | undefined {
  return novels.find((novel) => novel.id === id);
}

export function getChapterById(
  chapterId: number,
  novelId: number
): Chapter | undefined {
  return chapters.find(
    (chapter) => chapter.id === chapterId && chapter.novelId === novelId
  );
}

export function getChaptersByNovelId(novelId: number): Chapter[] {
  return chapters.filter((chapter) => chapter.novelId === novelId);
}

export function getNextChapter(
  currentChapterId: number,
  novelId: number
): Chapter | undefined {
  const novelChapters = getChaptersByNovelId(novelId);
  const currentIndex = novelChapters.findIndex(
    (chapter) => chapter.id === currentChapterId
  );
  return currentIndex < novelChapters.length - 1
    ? novelChapters[currentIndex + 1]
    : undefined;
}

export function getPrevChapter(
  currentChapterId: number,
  novelId: number
): Chapter | undefined {
  const novelChapters = getChaptersByNovelId(novelId);
  const currentIndex = novelChapters.findIndex(
    (chapter) => chapter.id === currentChapterId
  );
  return currentIndex > 0 ? novelChapters[currentIndex - 1] : undefined;
}
