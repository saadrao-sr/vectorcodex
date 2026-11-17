<?php
$root = __DIR__ . '/vectorcodex-lead-manager';
$out  = __DIR__ . '/vectorcodex-lead-manager.zip';

if (file_exists($out)) {
	unlink($out);
}

$zip = new ZipArchive();
if ($zip->open($out, ZipArchive::CREATE) !== true) {
	fwrite(STDERR, "Unable to create zip\n");
	exit(1);
}

$base = dirname($root);
$iterator = new RecursiveIteratorIterator(
	new RecursiveDirectoryIterator($root, FilesystemIterator::SKIP_DOTS)
);

foreach ($iterator as $file) {
	if (!$file->isFile()) {
		continue;
	}
	$full = $file->getPathname();
	if (substr($full, -4) === '.zip') {
		continue;
	}
	$rel = substr($full, strlen($base) + 1);
	$rel = str_replace('\\', '/', $rel);
	$zip->addFile($full, $rel);
}

$zip->close();

$check = new ZipArchive();
$check->open($out);
echo "Wrote {$out}\n";
echo 'count ' . $check->numFiles . "\n";
for ($i = 0; $i < $check->numFiles; $i++) {
	echo $check->getNameIndex($i) . "\n";
}
$check->close();
