import { MediaCardListProps } from '../MediaCardList.types';

import { MediaCardProps } from '@shared/components';

export const mock = async (
	args: Pick<MediaCardProps, 'view'>,
	start = 0,
	limit = 24
): Promise<MediaCardListProps> => {
	const items: MediaCardProps[] = await fetch(
		`https://jsonplaceholder.typicode.com/photos?_start=${start}&_limit=${limit}`
	)
		.then((response) => response.json())
		.then((json: unknown) => {
			const data = json as Array<{ id: number; title: string; url: string }>;

			return data.map((item, i) => {
				const type = Math.floor(Math.random() * 2) == 0;
				const preview = Math.floor(Math.random() * 2) == 0;

				const start = new Date();
				const end = new Date(1990, 0, 1);

				return {
					title: `#${i + 1} - ${item.title}`,
					description: Array(20)
						.join(` ${item.title}`)
						.split(' ')
						.sort(function () {
							return 0.5 - Math.random();
						})
						.join(' '),
					published_at: new Date(
						start.getTime() + Math.random() * (end.getTime() - start.getTime())
					),
					published_by: item.title.split(' ')[0] || 'Somebody',
					type: type ? 'audio' : 'video',
					preview: preview ? item.url.replace('/600/', '/496x322/') : undefined,
					view: args.view,
				};
			});
		});

	return {
		items,
		view: args.view,
	};
};

export const gridData: MediaCardProps[] = [
	{
		title: '#1 - accusamus beatae ad facilis cum similique qui sunt',
		description:
			'accusamus accusamus cum qui accusamus similique cum cum similique facilis accusamus cum qui similique beatae beatae ad beatae facilis sunt sunt facilis similique accusamus ad cum beatae accusamus qui similique facilis similique cum ad qui similique sunt cum beatae sunt accusamus beatae sunt ad sunt sunt cum similique sunt facilis ad sunt sunt qui qui qui cum beatae facilis ad ad cum qui cum sunt accusamus ad cum similique cum qui qui ad similique beatae ad similique facilis beatae beatae sunt accusamus  similique ad beatae facilis qui cum accusamus facilis beatae ad sunt facilis sunt accusamus accusamus beatae facilis similique similique ad beatae sunt similique facilis qui cum accusamus beatae facilis sunt cum similique qui ad similique beatae accusamus similique qui qui facilis accusamus beatae accusamus cum cum facilis accusamus ad facilis beatae accusamus sunt accusamus sunt sunt facilis facilis facilis ad ad qui qui similique beatae cum ad qui ad qui',
		published_at: new Date(),
		published_by: 'accusamus',
		type: 'video',
		preview: 'https://via.placeholder.com/496x322/92c952',
		view: 'grid',
	},
	{
		title: '#2 - reprehenderit est deserunt velit ipsam',
		description:
			'est velit deserunt est ipsam deserunt deserunt ipsam velit velit velit velit reprehenderit est ipsam ipsam deserunt velit est velit reprehenderit reprehenderit est ipsam est ipsam ipsam  deserunt deserunt ipsam est est reprehenderit reprehenderit velit reprehenderit deserunt deserunt velit ipsam velit ipsam deserunt reprehenderit velit est est deserunt reprehenderit ipsam ipsam velit deserunt ipsam reprehenderit deserunt deserunt deserunt ipsam ipsam deserunt velit deserunt reprehenderit ipsam velit velit reprehenderit ipsam reprehenderit velit reprehenderit velit deserunt est velit est est reprehenderit reprehenderit deserunt est ipsam reprehenderit velit est est deserunt est reprehenderit reprehenderit est ipsam reprehenderit est',
		published_at: new Date(),
		published_by: 'reprehenderit',
		type: 'audio',
		view: 'grid',
	},
	{
		title: '#3 - officia porro iure quia iusto qui ipsa ut modi',
		description:
			'ut iure porro quia iusto ipsa ut officia officia iure porro quia qui quia iusto iure officia iusto qui officia quia officia iusto officia quia officia quia iusto modi ipsa qui iure iure ipsa quia porro ut ipsa ipsa qui iure qui modi ipsa modi modi iusto ipsa iure ut quia porro porro ipsa iusto iusto officia modi iure iure quia ipsa porro officia ipsa ut qui iusto ut porro officia officia iusto quia modi ipsa qui iure  qui iure qui qui porro ipsa qui officia ut porro ut ipsa iure iure porro porro iusto ut ut quia officia modi modi iure ipsa officia ut iure officia qui iusto ipsa iure ut iusto ut modi porro iusto qui quia ut modi iusto ut modi ut qui qui quia officia porro officia ipsa iusto modi officia ut qui iusto quia quia ut modi quia porro ipsa modi qui porro ipsa iure qui ipsa iusto qui iure modi quia porro officia quia iusto modi iure ut quia modi porro modi porro modi porro',
		published_at: new Date(),
		published_by: 'officia',
		type: 'video',
		view: 'grid',
	},
	{
		title: '#4 - culpa odio esse rerum omnis laboriosam voluptate repudiandae',
		description:
			'rerum voluptate omnis  culpa rerum rerum laboriosam esse repudiandae esse esse repudiandae culpa omnis esse laboriosam culpa laboriosam odio voluptate rerum laboriosam culpa laboriosam laboriosam voluptate esse repudiandae esse laboriosam omnis esse repudiandae voluptate esse rerum odio esse esse laboriosam odio repudiandae esse repudiandae voluptate odio culpa odio laboriosam rerum laboriosam omnis rerum laboriosam omnis repudiandae rerum rerum culpa omnis laboriosam culpa voluptate voluptate culpa repudiandae laboriosam odio culpa omnis omnis culpa voluptate culpa rerum odio culpa odio repudiandae culpa voluptate voluptate culpa esse odio repudiandae repudiandae esse omnis rerum voluptate repudiandae omnis odio voluptate omnis rerum laboriosam omnis omnis esse esse rerum repudiandae laboriosam repudiandae culpa repudiandae odio voluptate repudiandae rerum culpa voluptate laboriosam rerum voluptate odio voluptate repudiandae esse repudiandae odio culpa culpa rerum laboriosam rerum odio omnis voluptate omnis voluptate rerum odio laboriosam culpa esse repudiandae odio voluptate esse odio omnis laboriosam odio omnis odio rerum omnis omnis esse',
		published_at: new Date(),
		published_by: 'culpa',
		type: 'video',
		preview: 'https://via.placeholder.com/496x322/d32776',
		view: 'grid',
	},
	{
		title: '#5 - natus nisi omnis corporis facere molestiae rerum in',
		description:
			'natus molestiae facere rerum facere in rerum molestiae  natus omnis in rerum natus natus rerum facere natus in in natus facere facere natus facere corporis in omnis molestiae in natus molestiae in corporis facere natus corporis facere nisi nisi facere in facere molestiae corporis corporis omnis in molestiae facere corporis corporis molestiae omnis omnis rerum omnis nisi molestiae molestiae molestiae natus rerum nisi natus nisi natus nisi in nisi facere corporis omnis in corporis molestiae nisi nisi omnis molestiae omnis corporis omnis rerum in rerum rerum rerum corporis corporis natus nisi nisi corporis nisi nisi nisi natus corporis rerum facere omnis rerum rerum omnis natus omnis rerum in in corporis corporis rerum molestiae rerum corporis facere molestiae nisi omnis molestiae nisi in molestiae nisi rerum omnis corporis in rerum in omnis molestiae natus rerum in natus natus corporis omnis omnis nisi facere facere in molestiae facere omnis natus nisi facere facere molestiae',
		published_at: new Date(),
		published_by: 'natus',
		type: 'video',
		view: 'grid',
	},
	{
		title: '#6 - accusamus ea aliquid et amet sequi nemo',
		description:
			'aliquid nemo amet amet et ea aliquid sequi nemo ea nemo nemo amet nemo amet amet nemo amet et et aliquid ea accusamus amet aliquid amet sequi nemo et et  aliquid ea aliquid accusamus aliquid ea nemo ea et amet sequi accusamus aliquid nemo accusamus nemo sequi ea amet accusamus accusamus et accusamus accusamus sequi aliquid et ea et nemo ea aliquid accusamus nemo sequi sequi sequi accusamus et accusamus aliquid sequi sequi nemo et nemo accusamus aliquid et aliquid amet sequi accusamus sequi ea sequi et amet ea nemo nemo ea accusamus sequi ea ea amet ea accusamus et ea et accusamus amet aliquid aliquid accusamus amet sequi ea nemo aliquid aliquid et sequi amet sequi amet amet aliquid aliquid et accusamus ea sequi accusamus amet nemo et nemo et sequi ea',
		published_at: new Date(),
		published_by: 'accusamus',
		type: 'audio',
		preview: 'https://via.placeholder.com/496x322/56a8c2',
		view: 'grid',
	},
	{
		title: '#7 - officia delectus consequatur vero aut veniam explicabo molestias',
		description:
			'aut aut delectus officia explicabo molestias aut vero consequatur consequatur delectus delectus molestias  veniam delectus vero molestias molestias veniam veniam officia molestias veniam officia officia explicabo aut veniam delectus vero veniam molestias molestias veniam delectus explicabo molestias molestias explicabo vero molestias molestias explicabo officia explicabo explicabo veniam explicabo consequatur aut vero aut aut explicabo consequatur consequatur delectus vero officia vero molestias officia officia consequatur officia vero delectus vero aut explicabo explicabo consequatur consequatur vero delectus aut aut aut consequatur explicabo consequatur aut veniam molestias consequatur veniam delectus veniam molestias veniam delectus vero molestias officia consequatur officia veniam officia vero consequatur molestias delectus delectus vero aut aut explicabo vero delectus veniam veniam explicabo vero officia explicabo consequatur aut explicabo aut explicabo delectus delectus vero molestias officia aut officia veniam delectus explicabo consequatur explicabo molestias vero consequatur aut delectus officia consequatur veniam officia vero officia molestias veniam officia aut vero veniam delectus consequatur consequatur',
		published_at: new Date(),
		published_by: 'officia',
		type: 'audio',
		preview: 'https://via.placeholder.com/496x322/b0f7cc',
		view: 'grid',
	},
	{
		title: '#8 - aut porro officiis laborum odit ea laudantium corporis',
		description:
			'officiis officiis aut ea ea porro laborum laudantium aut porro laborum laborum  odit laudantium corporis aut laudantium laborum corporis officiis corporis ea aut laborum aut aut corporis aut corporis odit ea odit corporis odit ea laborum odit aut laudantium aut ea ea laudantium porro laudantium porro corporis ea porro aut laudantium odit porro laudantium officiis odit corporis laudantium laborum laborum officiis porro officiis laborum laudantium laborum ea aut porro odit odit corporis porro aut porro corporis officiis corporis odit porro corporis odit odit officiis officiis ea laudantium officiis laudantium laudantium laborum aut officiis odit laudantium ea laudantium ea laborum odit officiis aut ea officiis corporis corporis laborum laudantium ea officiis ea aut corporis corporis porro laudantium laborum porro officiis laborum laudantium laborum odit ea corporis ea officiis odit officiis porro aut aut laborum porro laborum odit odit laudantium aut porro porro corporis officiis porro laborum ea ea porro odit aut officiis corporis',
		published_at: new Date(),
		published_by: 'aut',
		type: 'audio',
		preview: 'https://via.placeholder.com/496x322/54176f',
		view: 'grid',
	},
	{
		title: '#9 - qui eius qui autem sed',
		description:
			'sed autem qui qui qui sed qui sed eius autem qui eius sed qui autem qui qui autem sed eius sed eius qui qui  autem sed qui autem qui qui sed qui qui autem autem sed eius qui qui qui qui autem qui eius sed eius sed qui autem autem autem qui eius qui eius sed sed autem eius qui autem qui sed qui qui qui qui sed sed autem eius qui eius eius autem qui qui qui qui eius eius sed autem qui qui sed qui eius eius qui autem eius sed autem eius',
		published_at: new Date(),
		published_by: 'qui',
		type: 'video',
		preview: 'https://via.placeholder.com/496x322/51aa97',
		view: 'grid',
	},
	{
		title: '#10 - beatae et provident et ut vel',
		description:
			' vel ut et beatae vel et beatae vel et beatae vel et ut et vel et et ut provident vel et et ut provident provident ut provident et et et ut beatae et et provident et provident beatae ut provident et provident et vel ut beatae vel beatae ut et beatae ut beatae vel ut et provident ut ut et et vel et et et et beatae et vel provident et vel vel beatae provident beatae et et beatae ut vel et et et beatae ut provident et provident beatae vel et et ut et beatae beatae beatae provident provident provident provident beatae vel ut vel et et vel vel provident ut ut provident',
		published_at: new Date(),
		published_by: 'beatae',
		type: 'audio',
		preview: 'https://via.placeholder.com/496x322/810b14',
		view: 'grid',
	},
	{
		title: '#11 - nihil at amet non hic quia qui',
		description:
			'amet quia qui quia amet nihil at non nihil at amet non quia at non hic hic hic amet quia quia qui qui quia quia nihil amet amet quia hic at non at at quia hic qui nihil hic amet qui non hic non quia hic nihil qui hic quia quia non amet at quia qui amet non nihil non at quia nihil at non hic qui at amet non amet nihil non amet  nihil hic nihil at at at nihil hic qui non nihil amet qui hic non amet nihil at qui nihil qui amet at quia hic at nihil quia hic at non hic nihil nihil hic quia nihil non qui non qui quia amet non quia amet qui hic at qui hic at nihil amet qui qui qui amet non',
		published_at: new Date(),
		published_by: 'nihil',
		type: 'audio',
		view: 'grid',
	},
	{
		title: '#12 - mollitia soluta ut rerum eos aliquam consequatur perspiciatis maiores',
		description:
			'perspiciatis rerum soluta soluta mollitia rerum consequatur eos aliquam mollitia mollitia consequatur soluta aliquam maiores perspiciatis perspiciatis consequatur perspiciatis soluta maiores mollitia eos aliquam ut aliquam maiores maiores soluta maiores aliquam ut eos perspiciatis rerum aliquam aliquam rerum perspiciatis soluta mollitia mollitia aliquam eos perspiciatis rerum consequatur ut consequatur eos maiores soluta consequatur ut eos ut  rerum soluta consequatur aliquam aliquam ut aliquam soluta maiores ut consequatur soluta maiores ut ut consequatur eos aliquam rerum soluta eos ut perspiciatis maiores mollitia consequatur maiores soluta soluta ut eos rerum consequatur mollitia eos perspiciatis perspiciatis perspiciatis aliquam perspiciatis eos perspiciatis rerum rerum eos mollitia maiores mollitia consequatur mollitia maiores consequatur soluta maiores ut aliquam rerum ut consequatur mollitia eos aliquam ut aliquam perspiciatis consequatur eos mollitia soluta rerum maiores rerum ut rerum mollitia soluta ut consequatur maiores rerum aliquam rerum mollitia eos ut maiores perspiciatis perspiciatis ut perspiciatis soluta aliquam perspiciatis mollitia soluta maiores mollitia consequatur consequatur eos aliquam rerum consequatur eos eos rerum rerum soluta ut mollitia mollitia eos perspiciatis maiores maiores',
		published_at: new Date(),
		published_by: 'mollitia',
		type: 'video',
		preview: 'https://via.placeholder.com/496x322/66b7d2',
		view: 'grid',
	},
	{
		title: '#13 - repudiandae iusto deleniti rerum',
		description:
			'rerum iusto deleniti rerum deleniti iusto iusto iusto iusto rerum iusto repudiandae iusto iusto repudiandae rerum repudiandae rerum rerum deleniti iusto deleniti deleniti repudiandae iusto rerum deleniti rerum repudiandae  deleniti repudiandae iusto iusto deleniti deleniti iusto deleniti deleniti repudiandae deleniti repudiandae rerum repudiandae deleniti repudiandae iusto rerum rerum deleniti iusto deleniti iusto rerum rerum iusto repudiandae deleniti rerum repudiandae repudiandae deleniti repudiandae rerum iusto rerum rerum repudiandae iusto rerum repudiandae repudiandae deleniti repudiandae repudiandae deleniti rerum',
		published_at: new Date(),
		published_by: 'repudiandae',
		type: 'audio',
		preview: 'https://via.placeholder.com/496x322/197d29',
		view: 'grid',
	},
	{
		title: '#14 - est necessitatibus architecto ut laborum',
		description:
			'est laborum ut est ut necessitatibus necessitatibus ut necessitatibus laborum est est laborum necessitatibus ut necessitatibus necessitatibus est necessitatibus ut architecto ut necessitatibus architecto architecto necessitatibus laborum ut est architecto laborum laborum ut ut laborum necessitatibus necessitatibus est ut necessitatibus laborum est est architecto laborum laborum necessitatibus est necessitatibus laborum necessitatibus architecto est  ut laborum est laborum necessitatibus laborum architecto architecto architecto ut architecto architecto est est architecto laborum est architecto necessitatibus architecto est est architecto laborum architecto ut est ut necessitatibus ut laborum ut laborum architecto ut laborum necessitatibus est architecto ut ut architecto',
		published_at: new Date(),
		published_by: 'est',
		type: 'audio',
		preview: 'https://via.placeholder.com/496x322/61a65',
		view: 'grid',
	},
	{
		title: '#15 - harum dicta similique quis dolore earum ex qui',
		description:
			'similique harum quis harum dicta dolore harum harum ex dicta earum harum ex harum quis earum dicta similique similique dolore dicta qui dicta earum earum earum ex quis quis similique qui qui  dolore quis ex qui ex dolore ex similique similique earum similique qui quis ex earum earum dolore similique ex quis qui ex harum quis harum qui dolore dolore ex similique harum harum earum ex dolore dolore dicta dolore quis quis earum dicta dolore similique dolore dicta dicta qui earum quis similique earum ex similique similique dolore similique ex quis quis earum dicta similique qui dicta dolore dicta dicta qui harum harum dolore harum harum similique quis qui ex qui earum ex quis dicta qui harum ex quis earum quis dicta dicta qui earum dolore harum dicta qui qui similique ex dolore dolore qui quis ex harum ex dicta qui similique earum harum harum similique earum quis earum dolore qui dicta',
		published_at: new Date(),
		published_by: 'harum',
		type: 'video',
		view: 'grid',
	},
	{
		title: '#16 - iusto sunt nobis quasi veritatis quas expedita voluptatum deserunt',
		description:
			'veritatis expedita sunt quas nobis deserunt  expedita voluptatum voluptatum iusto expedita expedita quas quas iusto voluptatum voluptatum deserunt nobis expedita veritatis veritatis quas quas quas sunt iusto sunt voluptatum sunt quasi voluptatum sunt nobis nobis voluptatum voluptatum quas iusto iusto quasi iusto nobis quasi quasi voluptatum quas veritatis sunt deserunt quas expedita iusto veritatis sunt sunt sunt quas iusto quasi deserunt quasi veritatis sunt expedita deserunt deserunt quasi quas iusto quas nobis nobis deserunt veritatis deserunt voluptatum nobis nobis sunt voluptatum quas sunt quas veritatis deserunt expedita iusto sunt nobis sunt quasi voluptatum deserunt veritatis veritatis iusto quas veritatis quas deserunt deserunt veritatis sunt sunt veritatis quasi quas quasi expedita iusto quasi iusto quasi iusto nobis iusto nobis iusto expedita nobis voluptatum veritatis quasi iusto expedita quasi nobis sunt quas quasi nobis voluptatum nobis expedita expedita voluptatum veritatis expedita quas veritatis quasi expedita voluptatum deserunt voluptatum nobis deserunt deserunt quasi voluptatum voluptatum veritatis expedita quasi iusto expedita deserunt veritatis nobis nobis expedita sunt deserunt deserunt sunt deserunt quasi iusto expedita veritatis',
		published_at: new Date(),
		published_by: 'iusto',
		type: 'audio',
		view: 'grid',
	},
	{
		title: '#17 - natus doloribus necessitatibus ipsa',
		description:
			'ipsa necessitatibus  necessitatibus doloribus ipsa natus natus ipsa necessitatibus ipsa ipsa ipsa natus necessitatibus doloribus natus necessitatibus natus doloribus ipsa doloribus ipsa doloribus doloribus natus natus natus ipsa natus necessitatibus doloribus doloribus necessitatibus necessitatibus necessitatibus doloribus necessitatibus doloribus necessitatibus ipsa ipsa natus ipsa natus necessitatibus doloribus natus doloribus ipsa ipsa necessitatibus natus natus doloribus necessitatibus doloribus ipsa ipsa ipsa ipsa natus natus natus doloribus necessitatibus doloribus natus necessitatibus ipsa natus doloribus doloribus doloribus necessitatibus necessitatibus necessitatibus',
		published_at: new Date(),
		published_by: 'natus',
		type: 'video',
		preview: 'https://via.placeholder.com/496x322/9c184f',
		view: 'grid',
	},
	{
		title: '#18 - laboriosam odit nam necessitatibus et illum dolores reiciendis',
		description:
			'et necessitatibus necessitatibus et dolores illum dolores necessitatibus necessitatibus reiciendis dolores nam odit laboriosam odit dolores odit reiciendis et illum odit illum illum nam necessitatibus reiciendis odit illum odit et et odit reiciendis illum illum dolores dolores laboriosam odit necessitatibus et illum nam nam reiciendis reiciendis nam et odit odit laboriosam laboriosam reiciendis nam et laboriosam illum dolores necessitatibus necessitatibus laboriosam et dolores illum necessitatibus necessitatibus nam illum dolores illum laboriosam dolores odit laboriosam nam dolores odit illum odit et reiciendis reiciendis odit dolores necessitatibus laboriosam illum reiciendis odit et dolores nam illum dolores nam necessitatibus reiciendis necessitatibus laboriosam odit reiciendis et nam laboriosam laboriosam necessitatibus laboriosam reiciendis reiciendis et illum illum nam dolores laboriosam illum nam reiciendis necessitatibus dolores dolores necessitatibus nam laboriosam laboriosam reiciendis et dolores illum laboriosam  nam reiciendis nam necessitatibus et laboriosam et necessitatibus dolores odit reiciendis nam reiciendis et odit laboriosam et nam nam odit necessitatibus et',
		published_at: new Date(),
		published_by: 'laboriosam',
		type: 'audio',
		view: 'grid',
	},
	{
		title: '#19 - perferendis nesciunt eveniet et optio a',
		description:
			'et eveniet a perferendis eveniet perferendis a perferendis et optio a optio eveniet eveniet optio optio optio a perferendis eveniet optio et eveniet nesciunt eveniet nesciunt et eveniet a a et et eveniet nesciunt a a a et eveniet et optio optio optio a nesciunt optio et eveniet perferendis perferendis nesciunt perferendis eveniet perferendis nesciunt optio optio perferendis a et optio eveniet perferendis perferendis optio optio nesciunt perferendis a nesciunt nesciunt nesciunt et et a perferendis a a eveniet a eveniet perferendis optio eveniet  optio a a nesciunt nesciunt et nesciunt nesciunt eveniet perferendis optio optio nesciunt nesciunt eveniet et perferendis et et eveniet et nesciunt perferendis nesciunt et perferendis perferendis et a nesciunt',
		published_at: new Date(),
		published_by: 'perferendis',
		type: 'video',
		preview: 'https://via.placeholder.com/496x322/56acb2',
		view: 'grid',
	},
	{
		title: '#20 - assumenda voluptatem laboriosam enim consequatur veniam placeat reiciendis error',
		description:
			'enim enim consequatur assumenda veniam laboriosam reiciendis placeat assumenda enim error laboriosam laboriosam enim consequatur enim placeat consequatur enim consequatur veniam voluptatem consequatur laboriosam error enim laboriosam reiciendis placeat enim  laboriosam enim error reiciendis voluptatem consequatur voluptatem laboriosam placeat reiciendis placeat consequatur laboriosam veniam error enim placeat veniam error voluptatem assumenda veniam veniam reiciendis error enim voluptatem enim assumenda consequatur veniam placeat enim laboriosam veniam reiciendis reiciendis assumenda assumenda laboriosam placeat consequatur enim error error enim veniam laboriosam voluptatem consequatur consequatur reiciendis enim error reiciendis assumenda error reiciendis veniam assumenda consequatur reiciendis placeat assumenda veniam placeat assumenda reiciendis voluptatem placeat placeat consequatur veniam voluptatem voluptatem error veniam assumenda voluptatem laboriosam laboriosam laboriosam enim reiciendis voluptatem veniam reiciendis placeat consequatur error voluptatem placeat reiciendis voluptatem consequatur enim veniam enim reiciendis laboriosam laboriosam reiciendis assumenda consequatur error veniam placeat error placeat laboriosam consequatur voluptatem reiciendis laboriosam placeat consequatur assumenda voluptatem consequatur laboriosam assumenda voluptatem error voluptatem assumenda assumenda placeat veniam error assumenda veniam assumenda error placeat error reiciendis error assumenda veniam voluptatem voluptatem',
		published_at: new Date(),
		published_by: 'assumenda',
		type: 'video',
		preview: 'https://via.placeholder.com/496x322/8985dc',
		view: 'grid',
	},
	{
		title: '#21 - ad et natus qui',
		description:
			'natus natus et natus qui ad et et et et ad natus qui ad ad natus qui et ad natus qui et natus et ad qui et qui natus et qui natus et qui qui natus natus qui qui qui et natus ad qui natus ad ad qui natus et natus ad natus ad et ad natus natus et ad ad  qui et et natus qui ad ad ad qui ad ad et et qui qui',
		published_at: new Date(),
		published_by: 'ad',
		type: 'video',
		preview: 'https://via.placeholder.com/496x322/5e12c6',
		view: 'grid',
	},
	{
		title: '#22 - et ea illo et sit voluptas animi blanditiis porro',
		description:
			'illo blanditiis ea ea voluptas et et voluptas ea voluptas voluptas  ea porro et ea sit animi sit porro porro voluptas voluptas et et porro et ea animi animi et et illo et porro animi illo porro animi blanditiis sit illo sit et porro sit ea illo et sit et ea illo illo animi porro blanditiis blanditiis sit animi voluptas blanditiis ea et ea animi et sit porro et et animi voluptas voluptas ea illo et ea et blanditiis animi voluptas blanditiis et blanditiis sit ea porro blanditiis porro animi animi porro animi et et animi animi et voluptas voluptas porro voluptas animi sit ea porro et illo animi voluptas et et et illo porro illo blanditiis animi sit sit porro blanditiis illo et et et et blanditiis et ea et ea illo blanditiis porro illo et sit sit voluptas blanditiis et sit sit porro illo illo et voluptas blanditiis illo voluptas et et voluptas ea sit blanditiis ea blanditiis illo illo sit blanditiis ea animi voluptas sit et porro blanditiis',
		published_at: new Date(),
		published_by: 'et',
		type: 'video',
		view: 'grid',
	},
	{
		title: '#23 - harum velit vero totam',
		description:
			'totam vero vero harum harum totam harum harum vero totam velit vero velit totam totam vero totam harum velit velit harum totam velit totam harum totam  totam harum totam vero vero vero velit harum vero totam velit totam velit velit harum harum totam velit totam velit harum totam vero vero velit velit velit velit vero totam vero harum velit vero totam vero harum harum vero totam velit velit velit harum vero vero vero harum harum harum',
		published_at: new Date(),
		published_by: 'harum',
		type: 'video',
		preview: 'https://via.placeholder.com/496x322/e924e6',
		view: 'grid',
	},
	{
		title: '#24 - beatae officiis ut aut',
		description:
			'beatae aut officiis beatae beatae beatae beatae aut ut ut aut beatae ut aut beatae aut aut officiis officiis aut aut ut aut officiis ut officiis officiis ut beatae ut officiis aut beatae officiis aut beatae aut officiis ut aut officiis officiis officiis beatae ut officiis beatae ut ut ut beatae aut officiis beatae ut aut  ut ut beatae ut aut ut beatae ut officiis officiis officiis officiis aut ut officiis beatae beatae aut aut beatae',
		published_at: new Date(),
		published_by: 'beatae',
		type: 'video',
		view: 'grid',
	},
	{
		title: '#25 - facere non quis fuga fugit vitae',
		description:
			' non facere quis quis fugit vitae non vitae fugit fuga facere quis quis non quis non fuga quis fugit fugit facere fugit fugit vitae quis quis fugit fuga non facere facere non facere non vitae non vitae fugit vitae vitae fugit fuga vitae facere quis fugit facere vitae fugit fuga fuga fugit quis fuga vitae facere quis fugit non fuga vitae fugit fuga vitae non quis fuga fuga fugit facere non fuga fugit non facere facere non facere non quis vitae fuga quis fuga quis non facere facere quis fuga quis vitae quis quis vitae non vitae fuga vitae fuga facere fugit vitae fugit non fuga facere facere non fugit vitae fuga facere non',
		published_at: new Date(),
		published_by: 'facere',
		type: 'video',
		preview: 'https://via.placeholder.com/496x322/5e3a73',
		view: 'grid',
	},
];
