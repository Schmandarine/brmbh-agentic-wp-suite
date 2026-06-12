<?php
/**
 * Example Hero — block render template.
 *
 * Referenced by block.json via acf.renderTemplate. Receives $block, $is_preview.
 * Tokens drive the look — no hardcoded colors or sizes. See AGENTS/create-block.md.
 *
 * @var array $block
 */

$id = 'example-hero-' . ( $block['id'] ?? uniqid() );
if ( ! empty( $block['anchor'] ) ) {
	$id = $block['anchor'];
}

$class = 'example-hero section';
if ( ! empty( $block['className'] ) ) {
	$class .= ' ' . $block['className'];
}

$eyebrow = get_field( 'eyebrow' );
$heading = get_field( 'heading' );
$body    = get_field( 'body' );
$cta     = get_field( 'cta' );
?>
<section id="<?php echo esc_attr( $id ); ?>" class="<?php echo esc_attr( $class ); ?>">
	<div class="container">
		<div class="stack mx-auto text-center align-items-center" style="max-width: 48rem;">
			<?php if ( $eyebrow ) : ?>
				<p class="eyebrow"><?php echo esc_html( $eyebrow ); ?></p>
			<?php endif; ?>

			<?php if ( $heading ) : ?>
				<h1 class="display-3"><?php echo esc_html( $heading ); ?></h1>
			<?php endif; ?>

			<?php if ( $body ) : ?>
				<p class="lead"><?php echo esc_html( $body ); ?></p>
			<?php endif; ?>

			<?php if ( $cta && ! empty( $cta['url'] ) ) : ?>
				<a class="btn btn-primary"
				   href="<?php echo esc_url( $cta['url'] ); ?>"
				   target="<?php echo esc_attr( $cta['target'] ?: '_self' ); ?>">
					<?php echo esc_html( $cta['title'] ?: 'Learn more' ); ?>
				</a>
			<?php endif; ?>
		</div>
	</div>
</section>
