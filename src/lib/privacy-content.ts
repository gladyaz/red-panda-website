/**
 * The Privacy Policy text, in English and Indonesian.
 *
 * EVERY factual claim below was checked against the Red Panda mobile and
 * backend repositories before it was written. The audit is written up in
 * `docs/PRIVACY_FACT_INVENTORY.md`, which cites the file each fact came from.
 * Nothing here is a category copied from a template: if the app does not do it,
 * it is not in this document.
 *
 * Equally deliberate are the claims this document does NOT make. It does not
 * say data is end-to-end encrypted, that all on-device data is encrypted, that
 * anyone is certified against any standard, or that a social follow is
 * verified — because none of those are true, and a privacy policy is the worst
 * possible place to be optimistic.
 *
 * Both languages are the same `PolicySection[]` shape, so a section can never
 * exist in one language and quietly vanish from the other. A test asserts the
 * two documents have identical section ids in identical order.
 */

/**
 * Inline link tokens the renderer resolves. Kept to the two internal pages this
 * document genuinely needs to point at, so the copy stays plain data and the
 * renderer stays free of `dangerouslySetInnerHTML`.
 */
export const LINK_TOKENS = {
  '[[delete-account]]': '/delete-account',
  '[[support]]': '/support',
} as const;

export type PolicyBlock =
  | { readonly kind: 'paragraph'; readonly text: string }
  | { readonly kind: 'list'; readonly items: readonly string[] };

export interface PolicySection {
  readonly id: string;
  readonly title: string;
  readonly blocks: readonly PolicyBlock[];
}

export interface PolicyDocument {
  readonly locale: 'en' | 'id';
  readonly label: string;
  readonly title: string;
  readonly intro: string;
  readonly lastUpdatedLabel: string;
  readonly sections: readonly PolicySection[];
}

/** The date this text was written and last verified against the code. */
export const POLICY_LAST_UPDATED_ISO = '2026-08-27';

const EN_SECTIONS: readonly PolicySection[] = [
  {
    id: 'scope',
    title: 'What this policy covers',
    blocks: [
      {
        kind: 'paragraph',
        text: 'This policy describes what the Red Panda mobile app and its backend service collect, why, who it is shared with, how long it is kept, and how you can remove it. It covers the Red Panda Android app and this website.',
      },
      {
        kind: 'paragraph',
        text: 'You can browse the catalogue and watch episodes in Red Panda without an account. Most of what is described below only applies once you sign in.',
      },
    ],
  },
  {
    id: 'information-you-provide',
    title: 'Information you provide',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Red Panda creates an account for you when you sign in. What that account holds depends on how you signed in:',
      },
      {
        kind: 'list',
        items: [
          'Sign in with Google — we receive and store the account identifier Google issues for you. We also store your email address, but only when Google tells us that address has been verified; if it has not, no email address is stored for your account.',
          'Sign in with WhatsApp — we store your phone number in international format. The one-time code itself is never stored: we keep only a keyed cryptographic hash of it, and that record is deleted once the code has been used or has expired.',
          'Email and password — where used, we store your email address and a hashed form of your password. Your password itself is never stored.',
          'A display name, if you set one. This is optional and you choose it.',
          'The date your account was created.',
        ],
      },
      {
        kind: 'paragraph',
        text: 'Red Panda V1 has no payment, subscription or purchase of any kind, so no payment or billing information is ever collected.',
      },
    ],
  },
  {
    id: 'activity',
    title: 'What you do in Red Panda',
    blocks: [
      {
        kind: 'paragraph',
        text: 'When you are signed in, the following is stored against your account so that it follows you between devices:',
      },
      {
        kind: 'list',
        items: [
          'The videos you like and the ones you save.',
          'Your watch progress — which series, which episode number, and the position you stopped at.',
          'Your rewards activity: your coin balance, the full record of coins earned and spent, your daily check-ins, your progress towards watch missions, and any ad perks you have redeemed.',
          'Which social missions you have claimed, for Instagram, TikTok and YouTube.',
          'A limited set of app usage events, listed under "Technical and device information" below.',
        ],
      },
      {
        kind: 'paragraph',
        text: 'A social mission records that Red Panda gave you a link to one of its profiles and that you came back and confirmed you had followed it. Red Panda cannot and does not check whether you actually followed the account — no social platform offers a way to verify that. The reward is paid on your confirmation, not on any check with the platform, and Red Panda receives nothing at all from your Instagram, TikTok or YouTube account.',
      },
    ],
  },
  {
    id: 'advertising',
    title: 'Advertising',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Red Panda V1 is free and is supported by advertising. Ads are served by Google AdMob, and the only ad format the app shows is a full-screen interstitial between episodes.',
      },
      {
        kind: 'list',
        items: [
          'The app collects the Android Advertising ID, which Google AdMob uses to select and measure ads. This is a device identifier you can reset or opt out of in your Android settings.',
          'Where your region requires consent, Red Panda shows Google’s consent form before any ad is requested. If that consent is not given or the form cannot be shown, the app requests no ad at all.',
          'An "Ad Privacy Options" control appears in your Red Panda profile in the regions where Google indicates it is required, so you can change your choice later.',
          'What Google itself collects and does through AdMob is governed by Google’s own privacy policy, not by this one.',
        ],
      },
      {
        kind: 'paragraph',
        text: 'Red Panda does not use any other advertising network, and does not share your account information, watch history, likes or saves with advertisers.',
      },
    ],
  },
  {
    id: 'technical',
    title: 'Technical and device information',
    blocks: [
      {
        kind: 'paragraph',
        text: 'To run the service and keep accounts safe, the backend records:',
      },
      {
        kind: 'list',
        items: [
          'Sign-in and session records, including when a session was created, last used, and ended.',
          'A keyed cryptographic hash of the IP address a request came from, used to apply rate limits and to investigate suspicious sign-in activity. The IP address itself is not stored.',
          'A shortened, sanitised form of the device or browser identification string sent with a request.',
          'Security events such as a successful or failed sign-in, an account lockout, a password change, and an account deletion.',
        ],
      },
      {
        kind: 'paragraph',
        text: 'The app also sends a small, fixed set of usage events to Red Panda’s own servers — no third-party analytics service is involved. The events are: opening the home feed, starting playback of a video, liking a video, saving a video, moving to another episode, encountering a locked episode, and an app crash report. Each event carries only the video, series or episode it refers to, the platform, and a timestamp. The server discards any other property before storing the event.',
      },
      {
        kind: 'paragraph',
        text: 'Red Panda does not collect your location, contacts, calendar, photos, files, SMS messages, camera or microphone. The app does not request permission for any of those, and it sends no push notifications.',
      },
    ],
  },
  {
    id: 'on-device',
    title: 'Information stored on your device',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Some information is kept on your phone rather than sent to us:',
      },
      {
        kind: 'list',
        items: [
          'Your sign-in tokens are held in the Android system’s secure storage, which is backed by the Android Keystore. They are stored in encrypted form rather than as plain text.',
          'A local copy of your likes, saves and watch progress, so the app works while your connection is poor and can sync later.',
          'Your chosen app language, and the app’s own record of when it last showed an ad.',
        ],
      },
      {
        kind: 'paragraph',
        text: 'This data is kept in the app’s private storage area. Android automatic backup is switched off for Red Panda, so none of it is copied to Google Drive. Uninstalling the app removes it from your device — but that does not delete your account, which is a separate action described below.',
      },
      {
        kind: 'paragraph',
        text: 'No software can promise that data on a device is safe from every threat, and this policy does not make that claim. In particular, the local copy of your likes, saves and watch progress is stored in the app’s private area but is not itself encrypted.',
      },
    ],
  },
  {
    id: 'how-we-use',
    title: 'How this information is used',
    blocks: [
      {
        kind: 'list',
        items: [
          'To sign you in and keep you signed in.',
          'To play episodes and to resume them where you stopped.',
          'To keep your likes, saves and watchlist in step across your devices.',
          'To run the rewards programme and to pay out coins correctly.',
          'To serve ads and to pace how often they appear.',
          'To protect accounts — rate limiting, lockouts after repeated failed sign-ins, and investigating suspicious activity.',
          'To understand which parts of the app are used and to find crashes, using the limited event set described above.',
        ],
      },
      {
        kind: 'paragraph',
        text: 'Red Panda does not sell your personal information, and does not use it for advertising profiles of its own.',
      },
    ],
  },
  {
    id: 'sharing',
    title: 'Who this is shared with',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Red Panda shares information with the service providers it needs to operate, and for no other purpose:',
      },
      {
        kind: 'list',
        items: [
          'Google — verifies your identity when you use Sign in with Google, and serves ads through AdMob.',
          'Meta — delivers your WhatsApp one-time code through the WhatsApp Business Platform, when you sign in with WhatsApp.',
          'Cloudflare — stores and delivers video and image files, and serves the adaptive streaming that plays them.',
          'The hosting and database providers that run the Red Panda service.',
        ],
      },
      {
        kind: 'paragraph',
        text: 'Beyond that, information is disclosed only where the law requires it, or where it is necessary to investigate abuse or protect the service and the people using it.',
      },
    ],
  },
  {
    id: 'retention',
    title: 'How long this is kept',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Your account information and your activity — likes, saves, watch progress and rewards — are kept for as long as your account exists, and are removed when you delete it. Other records are kept for a fixed period and then deleted:',
      },
      {
        kind: 'list',
        items: [
          'Sign-in session records, once expired or ended: 90 days.',
          'Password reset records, once used or expired: 90 days.',
          'App usage and crash events: 180 days.',
          'Watch progress, if it is never updated again: 2 years.',
          'Security and sign-in audit records: 2 years.',
          'A WhatsApp one-time code record: removed shortly after the code is used or expires.',
        ],
      },
    ],
  },
  {
    id: 'choices',
    title: 'Your choices',
    blocks: [
      {
        kind: 'list',
        items: [
          'Export your data — in the app, open Profile, then Data & Privacy, then Export My Data. You get a copy of your profile, your sign-in methods, your likes and saves, your watch progress and your app usage events. It is shown on your device only.',
          'Change your ad choices — where the option applies to your region, use Ad Privacy Options in your profile.',
          'Reset or opt out of the advertising identifier — in your Android system settings.',
          'Sign out — this ends the session on that device.',
          'Delete your account — see below.',
        ],
      },
    ],
  },
  {
    id: 'deletion',
    title: 'Deleting your account',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Deleting your Red Panda account is immediate and permanent. There is no grace period and it cannot be undone.',
      },
      {
        kind: 'paragraph',
        text: 'Deleting your account removes your account record, your sign-in methods, every session, your likes and saves, your watch progress, and your entire rewards balance and history.',
      },
      {
        kind: 'paragraph',
        text: 'Two kinds of record are kept afterwards, and both are stripped of any link to you at the moment of deletion. App usage events survive with the account reference removed. Security audit records survive with the account reference, the IP hash, the device identification string and all other detail removed — leaving only which type of security event occurred and when. These are kept to detect and investigate abuse, and they age out on the schedules listed above.',
      },
      {
        kind: 'paragraph',
        text: 'Full instructions, including what to do if you signed in with Google or WhatsApp, are on the [[delete-account]] page.',
      },
    ],
  },
  {
    id: 'children',
    title: "Children's privacy",
    blocks: [
      {
        kind: 'paragraph',
        text: 'Red Panda is a general-audience drama streaming service and is not directed at children. It is not intended for use by anyone under 13, and Red Panda does not knowingly collect personal information from a child under 13. If you believe a child has given us their information, contact us and we will delete the account and its data.',
      },
    ],
  },
  {
    id: 'security',
    title: 'Security',
    blocks: [
      {
        kind: 'list',
        items: [
          'All traffic between the app and the Red Panda service uses HTTPS.',
          'Passwords are stored only as a salted hash, never in a form that can be read back.',
          'Sign-in tokens are stored on the server only as a keyed hash, and on your device in the Android system’s secure storage.',
          'One-time codes are stored only as a keyed hash, are single-use, expire quickly, and allow a limited number of attempts.',
          'Video files are held in private storage and are served through short-lived links that expire.',
          'Repeated failed sign-ins lock an account temporarily, and sensitive actions such as account deletion are rate limited.',
        ],
      },
      {
        kind: 'paragraph',
        text: 'These measures reduce risk; they do not eliminate it. No online service can guarantee absolute security, and Red Panda does not claim to. Red Panda holds no security or privacy certification, and none is implied by anything in this policy.',
      },
    ],
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    blocks: [
      {
        kind: 'paragraph',
        text: 'This policy will change as Red Panda changes. When it does, the date at the top of this page is updated. For a change that materially affects how your information is handled, we will give notice in the app before it takes effect.',
      },
    ],
  },
  {
    id: 'contact',
    title: 'Contact',
    blocks: [
      {
        kind: 'paragraph',
        text: 'For any question about this policy, about the information held for your account, or to request deletion, use the contact details on the [[support]] page.',
      },
    ],
  },
];

const ID_SECTIONS: readonly PolicySection[] = [
  {
    id: 'scope',
    title: 'Cakupan kebijakan ini',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Kebijakan ini menjelaskan data apa yang dikumpulkan oleh aplikasi Red Panda dan layanan servernya, untuk apa data itu dipakai, dibagikan kepada siapa, berapa lama disimpan, dan bagaimana kamu bisa menghapusnya. Kebijakan ini berlaku untuk aplikasi Android Red Panda dan situs web ini.',
      },
      {
        kind: 'paragraph',
        text: 'Kamu bisa menjelajah katalog dan menonton episode di Red Panda tanpa akun. Sebagian besar hal di bawah ini baru berlaku setelah kamu masuk.',
      },
    ],
  },
  {
    id: 'information-you-provide',
    title: 'Data yang kamu berikan',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Red Panda membuat akun untukmu saat kamu masuk. Isi akun itu tergantung cara kamu masuk:',
      },
      {
        kind: 'list',
        items: [
          'Masuk dengan Google — kami menerima dan menyimpan pengenal akun yang diterbitkan Google untukmu. Alamat email juga disimpan, tetapi hanya jika Google menyatakan alamat itu sudah terverifikasi; jika belum, tidak ada alamat email yang disimpan untuk akunmu.',
          'Masuk dengan WhatsApp — kami menyimpan nomor teleponmu dalam format internasional. Kode sekali pakainya sendiri tidak pernah disimpan: kami hanya menyimpan hash kriptografis berkunci dari kode itu, dan catatan tersebut dihapus setelah kode dipakai atau kedaluwarsa.',
          'Email dan password — jika dipakai, kami menyimpan alamat email dan password dalam bentuk hash. Password aslinya tidak pernah disimpan.',
          'Nama tampilan, jika kamu mengaturnya. Ini opsional dan kamu yang memilihnya.',
          'Tanggal akunmu dibuat.',
        ],
      },
      {
        kind: 'paragraph',
        text: 'Red Panda V1 tidak memiliki pembayaran, langganan, atau pembelian dalam bentuk apa pun, sehingga tidak ada data pembayaran atau penagihan yang pernah dikumpulkan.',
      },
    ],
  },
  {
    id: 'activity',
    title: 'Aktivitasmu di Red Panda',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Saat kamu masuk, hal-hal berikut disimpan pada akunmu supaya ikut berpindah antar perangkat:',
      },
      {
        kind: 'list',
        items: [
          'Video yang kamu sukai dan video yang kamu simpan.',
          'Progres tontonanmu — serial mana, episode ke berapa, dan posisi terakhir kamu berhenti.',
          'Aktivitas Rewards: saldo koin, seluruh catatan koin yang diperoleh dan dipakai, check-in harian, progres misi menonton, serta perk iklan yang sudah kamu tukarkan.',
          'Misi sosial yang sudah kamu klaim, untuk Instagram, TikTok, dan YouTube.',
          'Sejumlah kecil peristiwa penggunaan aplikasi, yang dirinci di bagian "Informasi teknis dan perangkat" di bawah.',
        ],
      },
      {
        kind: 'paragraph',
        text: 'Misi sosial hanya mencatat bahwa Red Panda memberimu tautan ke salah satu profilnya dan bahwa kamu kembali lalu mengonfirmasi sudah mengikuti profil itu. Red Panda tidak bisa dan tidak memeriksa apakah kamu benar-benar mengikuti akun tersebut — tidak ada platform sosial yang menyediakan cara untuk memverifikasinya. Hadiah diberikan atas dasar konfirmasimu, bukan atas pemeriksaan apa pun ke platform, dan Red Panda tidak menerima apa pun dari akun Instagram, TikTok, atau YouTube-mu.',
      },
    ],
  },
  {
    id: 'advertising',
    title: 'Iklan',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Red Panda V1 gratis dan didukung oleh iklan. Iklan disajikan oleh Google AdMob, dan satu-satunya format iklan yang ditampilkan aplikasi adalah interstisial layar penuh di antara episode.',
      },
      {
        kind: 'list',
        items: [
          'Aplikasi mengumpulkan Advertising ID Android, yang dipakai Google AdMob untuk memilih dan mengukur iklan. Ini adalah pengenal perangkat yang bisa kamu atur ulang atau nonaktifkan di pengaturan Android.',
          'Di wilayah yang mensyaratkan persetujuan, Red Panda menampilkan formulir persetujuan dari Google sebelum iklan diminta. Jika persetujuan tidak diberikan atau formulirnya tidak bisa ditampilkan, aplikasi tidak meminta iklan sama sekali.',
          'Kontrol "Ad Privacy Options" muncul di profil Red Panda-mu di wilayah yang menurut Google membutuhkannya, sehingga kamu bisa mengubah pilihanmu di lain waktu.',
          'Apa yang dikumpulkan dan dilakukan Google sendiri melalui AdMob tunduk pada kebijakan privasi Google, bukan pada kebijakan ini.',
        ],
      },
      {
        kind: 'paragraph',
        text: 'Red Panda tidak memakai jaringan iklan lain, dan tidak membagikan data akun, riwayat tontonan, suka, atau simpananmu kepada pengiklan.',
      },
    ],
  },
  {
    id: 'technical',
    title: 'Informasi teknis dan perangkat',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Untuk menjalankan layanan dan menjaga keamanan akun, server mencatat:',
      },
      {
        kind: 'list',
        items: [
          'Catatan masuk dan sesi, termasuk kapan sesi dibuat, terakhir dipakai, dan diakhiri.',
          'Hash kriptografis berkunci dari alamat IP asal permintaan, dipakai untuk membatasi laju permintaan dan menyelidiki aktivitas masuk yang mencurigakan. Alamat IP-nya sendiri tidak disimpan.',
          'Bentuk singkat dan tersaring dari string identifikasi perangkat atau peramban yang dikirim bersama permintaan.',
          'Peristiwa keamanan seperti keberhasilan atau kegagalan masuk, penguncian akun, penggantian password, dan penghapusan akun.',
        ],
      },
      {
        kind: 'paragraph',
        text: 'Aplikasi juga mengirim sekumpulan kecil peristiwa penggunaan ke server Red Panda sendiri — tidak ada layanan analitik pihak ketiga yang terlibat. Peristiwanya adalah: membuka feed utama, mulai memutar video, menyukai video, menyimpan video, berpindah ke episode lain, menemui episode terkunci, dan laporan aplikasi berhenti mendadak. Setiap peristiwa hanya membawa video, serial, atau episode yang dirujuk, platform, dan waktu. Server membuang properti lain sebelum menyimpannya.',
      },
      {
        kind: 'paragraph',
        text: 'Red Panda tidak mengumpulkan lokasi, kontak, kalender, foto, berkas, pesan SMS, kamera, atau mikrofonmu. Aplikasi tidak meminta izin untuk semua itu, dan tidak mengirim notifikasi push.',
      },
    ],
  },
  {
    id: 'on-device',
    title: 'Data yang tersimpan di perangkatmu',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Sebagian data disimpan di ponselmu, bukan dikirim ke kami:',
      },
      {
        kind: 'list',
        items: [
          'Token masukmu disimpan di penyimpanan aman sistem Android, yang didukung Android Keystore. Token disimpan dalam bentuk terenkripsi, bukan teks biasa.',
          'Salinan lokal dari suka, simpanan, dan progres tontonanmu, supaya aplikasi tetap berjalan saat koneksi buruk dan bisa disinkronkan kemudian.',
          'Bahasa aplikasi yang kamu pilih, dan catatan internal aplikasi tentang kapan terakhir kali menampilkan iklan.',
        ],
      },
      {
        kind: 'paragraph',
        text: 'Data ini berada di area penyimpanan privat aplikasi. Pencadangan otomatis Android dimatikan untuk Red Panda, jadi tidak ada yang disalin ke Google Drive. Menghapus instalasi aplikasi akan menghapusnya dari perangkatmu — tetapi itu tidak menghapus akunmu, yang merupakan tindakan terpisah dan dijelaskan di bawah.',
      },
      {
        kind: 'paragraph',
        text: 'Tidak ada perangkat lunak yang bisa menjanjikan data di sebuah perangkat aman dari segala ancaman, dan kebijakan ini tidak mengklaim demikian. Khususnya, salinan lokal suka, simpanan, dan progres tontonanmu berada di area privat aplikasi tetapi tidak dienkripsi.',
      },
    ],
  },
  {
    id: 'how-we-use',
    title: 'Bagaimana data ini dipakai',
    blocks: [
      {
        kind: 'list',
        items: [
          'Untuk membuatmu masuk dan tetap masuk.',
          'Untuk memutar episode dan melanjutkannya dari posisi terakhir.',
          'Untuk menyelaraskan suka, simpanan, dan daftar tontonanmu di semua perangkat.',
          'Untuk menjalankan program Rewards dan membayarkan koin dengan benar.',
          'Untuk menayangkan iklan dan mengatur seberapa sering iklan muncul.',
          'Untuk melindungi akun — pembatasan laju, penguncian setelah berkali-kali gagal masuk, dan penyelidikan aktivitas mencurigakan.',
          'Untuk memahami bagian mana dari aplikasi yang dipakai dan menemukan kerusakan, memakai kumpulan peristiwa terbatas yang dijelaskan di atas.',
        ],
      },
      {
        kind: 'paragraph',
        text: 'Red Panda tidak menjual data pribadimu, dan tidak memakainya untuk membangun profil iklan miliknya sendiri.',
      },
    ],
  },
  {
    id: 'sharing',
    title: 'Dengan siapa data ini dibagikan',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Red Panda membagikan data kepada penyedia layanan yang dibutuhkan untuk beroperasi, dan tidak untuk tujuan lain:',
      },
      {
        kind: 'list',
        items: [
          'Google — memverifikasi identitasmu saat kamu memakai Masuk dengan Google, dan menayangkan iklan melalui AdMob.',
          'Meta — mengirimkan kode sekali pakai WhatsApp-mu melalui WhatsApp Business Platform, saat kamu masuk dengan WhatsApp.',
          'Cloudflare — menyimpan dan mengantarkan berkas video dan gambar, serta melayani streaming adaptif yang memutarnya.',
          'Penyedia hosting dan basis data yang menjalankan layanan Red Panda.',
        ],
      },
      {
        kind: 'paragraph',
        text: 'Di luar itu, data hanya diungkapkan jika diwajibkan hukum, atau jika diperlukan untuk menyelidiki penyalahgunaan serta melindungi layanan dan penggunanya.',
      },
    ],
  },
  {
    id: 'retention',
    title: 'Berapa lama data disimpan',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Data akun dan aktivitasmu — suka, simpanan, progres tontonan, dan Rewards — disimpan selama akunmu ada, dan dihapus saat kamu menghapus akun. Catatan lain disimpan untuk jangka waktu tetap lalu dihapus:',
      },
      {
        kind: 'list',
        items: [
          'Catatan sesi masuk, setelah kedaluwarsa atau diakhiri: 90 hari.',
          'Catatan pengaturan ulang password, setelah dipakai atau kedaluwarsa: 90 hari.',
          'Peristiwa penggunaan aplikasi dan laporan kerusakan: 180 hari.',
          'Progres tontonan, jika tidak pernah diperbarui lagi: 2 tahun.',
          'Catatan audit keamanan dan masuk: 2 tahun.',
          'Catatan kode sekali pakai WhatsApp: dihapus tak lama setelah kode dipakai atau kedaluwarsa.',
        ],
      },
    ],
  },
  {
    id: 'choices',
    title: 'Pilihanmu',
    blocks: [
      {
        kind: 'list',
        items: [
          'Ekspor datamu — di aplikasi, buka Profil, lalu Data & Privasi, lalu Ekspor Data Saya. Kamu mendapatkan salinan profil, metode masuk, suka dan simpanan, progres tontonan, serta peristiwa penggunaan aplikasimu. Salinan itu hanya ditampilkan di perangkatmu.',
          'Ubah pilihan iklanmu — jika opsi ini berlaku di wilayahmu, pakai Ad Privacy Options di profilmu.',
          'Atur ulang atau nonaktifkan pengenal iklan — di pengaturan sistem Android.',
          'Keluar — ini mengakhiri sesi di perangkat tersebut.',
          'Hapus akunmu — lihat di bawah.',
        ],
      },
    ],
  },
  {
    id: 'deletion',
    title: 'Menghapus akunmu',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Menghapus akun Red Panda bersifat langsung dan permanen. Tidak ada masa tenggang dan tidak bisa dibatalkan.',
      },
      {
        kind: 'paragraph',
        text: 'Menghapus akun akan menghapus catatan akunmu, metode masukmu, seluruh sesi, suka dan simpananmu, progres tontonanmu, serta seluruh saldo dan riwayat Rewards-mu.',
      },
      {
        kind: 'paragraph',
        text: 'Ada dua jenis catatan yang tetap disimpan setelahnya, dan keduanya diputus kaitannya denganmu pada saat penghapusan. Peristiwa penggunaan aplikasi tetap ada dengan rujukan akun dihapus. Catatan audit keamanan tetap ada dengan rujukan akun, hash IP, string identifikasi perangkat, dan seluruh detail lain dihapus — menyisakan hanya jenis peristiwa keamanan yang terjadi dan waktunya. Catatan ini disimpan untuk mendeteksi dan menyelidiki penyalahgunaan, dan akan terhapus sesuai jadwal di atas.',
      },
      {
        kind: 'paragraph',
        text: 'Petunjuk lengkap, termasuk apa yang harus dilakukan jika kamu masuk dengan Google atau WhatsApp, ada di halaman [[delete-account]].',
      },
    ],
  },
  {
    id: 'children',
    title: 'Privasi anak',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Red Panda adalah layanan streaming drama untuk khalayak umum dan tidak ditujukan bagi anak-anak. Layanan ini tidak diperuntukkan bagi siapa pun di bawah 13 tahun, dan Red Panda tidak dengan sengaja mengumpulkan data pribadi anak di bawah 13 tahun. Jika kamu yakin seorang anak telah memberikan datanya kepada kami, hubungi kami dan kami akan menghapus akun beserta datanya.',
      },
    ],
  },
  {
    id: 'security',
    title: 'Keamanan',
    blocks: [
      {
        kind: 'list',
        items: [
          'Semua lalu lintas antara aplikasi dan layanan Red Panda memakai HTTPS.',
          'Password hanya disimpan sebagai hash bergaram, tidak pernah dalam bentuk yang bisa dibaca kembali.',
          'Token masuk hanya disimpan sebagai hash berkunci di server, dan di perangkatmu disimpan di penyimpanan aman sistem Android.',
          'Kode sekali pakai hanya disimpan sebagai hash berkunci, hanya bisa dipakai sekali, cepat kedaluwarsa, dan membatasi jumlah percobaan.',
          'Berkas video disimpan di penyimpanan privat dan disajikan lewat tautan berumur pendek yang akan kedaluwarsa.',
          'Kegagalan masuk berulang akan mengunci akun sementara, dan tindakan sensitif seperti penghapusan akun dibatasi lajunya.',
        ],
      },
      {
        kind: 'paragraph',
        text: 'Langkah-langkah ini mengurangi risiko, bukan menghilangkannya. Tidak ada layanan daring yang bisa menjamin keamanan mutlak, dan Red Panda tidak mengklaim demikian. Red Panda tidak memegang sertifikasi keamanan atau privasi apa pun, dan tidak ada bagian dari kebijakan ini yang menyiratkan sebaliknya.',
      },
    ],
  },
  {
    id: 'changes',
    title: 'Perubahan kebijakan ini',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Kebijakan ini akan berubah seiring perubahan Red Panda. Saat itu terjadi, tanggal di bagian atas halaman ini diperbarui. Untuk perubahan yang berdampak material terhadap cara datamu ditangani, kami akan memberi tahu di dalam aplikasi sebelum perubahan itu berlaku.',
      },
    ],
  },
  {
    id: 'contact',
    title: 'Kontak',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Untuk pertanyaan apa pun tentang kebijakan ini, tentang data yang tersimpan untuk akunmu, atau untuk meminta penghapusan, gunakan kontak di halaman [[support]].',
      },
    ],
  },
];

export const PRIVACY_DOCUMENTS: readonly PolicyDocument[] = [
  {
    locale: 'en',
    label: 'English',
    title: 'Privacy Policy',
    intro:
      'How Red Panda handles your information — what is collected, why, who it goes to, how long it is kept, and how to remove it.',
    lastUpdatedLabel: 'Last updated 27 August 2026',
    sections: EN_SECTIONS,
  },
  {
    locale: 'id',
    label: 'Bahasa Indonesia',
    title: 'Kebijakan Privasi',
    intro:
      'Bagaimana Red Panda menangani datamu — apa yang dikumpulkan, untuk apa, dibagikan ke siapa, berapa lama disimpan, dan cara menghapusnya.',
    lastUpdatedLabel: 'Terakhir diperbarui 27 Agustus 2026',
    sections: ID_SECTIONS,
  },
];
